using System;
using Ems.Backend.Models;

namespace Ems.Backend.DTOs
{
    public class AuditLogDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UserDto User { get; set; } = null!;
        public AuditAction Action { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }
        public string OldData { get; set; } = "{}";
        public string NewData { get; set; } = "{}";
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AuditLogCreateDto
    {
        public Guid UserId { get; set; }
        public AuditAction Action { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }
        public object? OldData { get; set; }
        public object? NewData { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
    }
}
