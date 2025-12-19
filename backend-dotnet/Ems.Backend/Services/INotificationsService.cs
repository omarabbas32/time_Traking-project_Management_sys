using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface INotificationsService
    {
        Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false);
        Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto);
        Task<bool> MarkAsReadAsync(Guid id, Guid userId);
        Task<bool> MarkAllAsReadAsync(Guid userId);
        Task<int> GetUnreadCountAsync(Guid userId);
    }
}
