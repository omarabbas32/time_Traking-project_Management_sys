using System;
using Ems.Backend.Models;

namespace Ems.Backend.DTOs
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public NotificationType Type { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public Guid? RelatedProjectId { get; set; }
        public Guid? RelatedTaskId { get; set; }
        public string Metadata { get; set; } = "{}";
        public DateTime CreatedAt { get; set; }
    }

    public class NotificationCreateDto
    {
        public Guid UserId { get; set; }
        public NotificationType Type { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Guid? RelatedProjectId { get; set; }
        public Guid? RelatedTaskId { get; set; }
        public string? Metadata { get; set; }
    }
}
