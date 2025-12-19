using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ems.Backend.DTOs;
using Ems.Backend.Services;
using System.Security.Claims;

namespace Ems.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _usersService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _usersService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UserUpdateDto dto)
        {
            // Only admin or the user themselves can update
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserId != id && currentUserRole != "Admin")
            {
                return Forbid();
            }

            var updatedUser = await _usersService.UpdateUserAsync(id, dto);
            if (updatedUser == null) return NotFound();
            return Ok(updatedUser);
        }

        [HttpPost("{id}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateUser(Guid id)
        {
            var result = await _usersService.DeactivateUserAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "User deactivated successfully" });
        }

        [HttpPost("{id}/activate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ActivateUser(Guid id)
        {
            var result = await _usersService.ActivateUserAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "User activated successfully" });
        }
    }
}
