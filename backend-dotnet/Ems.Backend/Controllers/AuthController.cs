using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ems.Backend.DTOs;
using Ems.Backend.Services;
using System.Security.Claims;

namespace Ems.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginDto dto)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = Request.Headers["User-Agent"].ToString();
                
                var response = await _authService.LoginAsync(dto, ipAddress, userAgent);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var user = await _authService.RegisterAsync(dto, adminId);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthTokens>> Refresh([FromBody] string refreshToken)
        {
            try
            {
                var tokens = await _authService.RefreshTokenAsync(refreshToken);
                return Ok(tokens);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var accessToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            
            await _authService.LogoutAsync(userId, accessToken);
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var profile = await _authService.GetProfileAsync(userId);
            return Ok(profile);
        }
    }
}
