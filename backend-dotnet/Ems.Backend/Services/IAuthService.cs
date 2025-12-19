using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginDto dto, string? ipAddress, string? userAgent);
        Task<UserDto> RegisterAsync(RegisterDto dto, Guid createdByUserId);
        Task<AuthTokens> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(Guid userId, string? accessToken = null);
        Task<UserDto> GetProfileAsync(Guid userId);
    }
}
