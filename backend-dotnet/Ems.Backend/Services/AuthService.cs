using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;
using BC = BCrypt.Net.BCrypt;

namespace Ems.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            IConfiguration configuration,
            IMapper mapper,
            ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<AuthResponse> LoginAsync(LoginDto dto, string? ipAddress, string? userAgent)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !user.IsActive || !BC.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid login attempt for email: {Email}", dto.Email);
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var tokens = GenerateTokens(user);
            await CreateSessionAsync(user.Id, tokens, ipAddress, userAgent);

            _logger.LogInformation("User logged in: {Email}", user.Email);

            return new AuthResponse
            {
                User = _mapper.Map<UserDto>(user),
                Tokens = tokens
            };
        }

        public async Task<UserDto> RegisterAsync(RegisterDto dto, Guid createdByUserId)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BC.HashPassword(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = dto.Role,
                Phone = dto.Phone,
                Department = dto.Department
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New user registered: {Email} by {AdminId}", user.Email, createdByUserId);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<AuthTokens> RefreshTokenAsync(string refreshToken)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.RefreshTokenHash == HashToken(refreshToken) && s.IsValid && s.RefreshExpiresAt > DateTime.UtcNow);

            if (session == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }

            var user = await _context.Users.FindAsync(session.UserId);
            if (user == null || !user.IsActive)
            {
                throw new UnauthorizedAccessException("User not found or inactive");
            }

            session.IsValid = false; // Invalidate old session
            
            var tokens = GenerateTokens(user);
            await CreateSessionAsync(user.Id, tokens, session.IpAddress, session.UserAgent);

            return tokens;
        }

        public async Task LogoutAsync(Guid userId, string? accessToken = null)
        {
            if (accessToken != null)
            {
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.TokenHash == HashToken(accessToken) && s.UserId == userId);
                if (session != null)
                {
                    session.IsValid = false;
                }
            }
            else
            {
                var sessions = await _context.UserSessions
                    .Where(s => s.UserId == userId && s.IsValid)
                    .ToListAsync();
                foreach (var session in sessions)
                {
                    session.IsValid = false;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<UserDto> GetProfileAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            return _mapper.Map<UserDto>(user);
        }

        private AuthTokens GenerateTokens(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? string.Empty));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            var refreshToken = GenerateRefreshToken();

            return new AuthTokens
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                RefreshToken = refreshToken,
                ExpiresIn = 3600
            };
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task CreateSessionAsync(Guid userId, AuthTokens tokens, string? ipAddress, string? userAgent)
        {
            var session = new UserSession
            {
                UserId = userId,
                TokenHash = HashToken(tokens.AccessToken),
                RefreshTokenHash = HashToken(tokens.RefreshToken),
                IpAddress = ipAddress,
                UserAgent = userAgent,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                RefreshExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            await _context.UserSessions.AddAsync(session);
            await _context.SaveChangesAsync();
        }

        private string HashToken(string token)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
