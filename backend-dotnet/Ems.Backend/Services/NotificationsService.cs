using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class NotificationsService : INotificationsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<NotificationsService> _logger;

        public NotificationsService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<NotificationsService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false)
        {
            var query = _context.Notifications
                .Where(n => n.UserId == userId);

            if (unreadOnly)
            {
                query = query.Where(n => !n.IsRead);
            }

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .ToListAsync();

            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Type = dto.Type,
                Title = dto.Title,
                Message = dto.Message,
                ReferenceType = dto.RelatedProjectId.HasValue ? "Project" : (dto.RelatedTaskId.HasValue ? "Task" : null),
                ReferenceId = dto.RelatedProjectId ?? dto.RelatedTaskId,
                Metadata = dto.Metadata ?? "{}"
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New notification created for user {UserId}: {Title}", dto.UserId, dto.Title);

            return _mapper.Map<NotificationDto>(notification);
        }

        public async Task<bool> MarkAsReadAsync(Guid id, Guid userId)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null || notification.UserId != userId) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(Guid userId)
        {
            var unread = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }
    }
}
