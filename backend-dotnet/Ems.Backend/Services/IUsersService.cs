using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public interface IUsersService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task<UserDto> UpdateUserAsync(Guid id, UserUpdateDto dto);
        Task<bool> DeactivateUserAsync(Guid id);
        Task<bool> ActivateUserAsync(Guid id);
    }
}
