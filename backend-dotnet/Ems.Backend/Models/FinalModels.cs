using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ems.Backend.Models
{
    [Table("notifications")]
    public class Notification
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        [Column("type")]
        public NotificationType Type { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("message")]
        public string Message { get; set; } = string.Empty;

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [Column("read_at")]
        public DateTime? ReadAt { get; set; }

        [Column("reference_type")]
        public string? ReferenceType { get; set; }

        [Column("reference_id")]
        public Guid? ReferenceId { get; set; }

        [Column("action_url")]
        public string? ActionUrl { get; set; }

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; } = "{}";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("audit_logs")]
    public class AppAuditLog
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column("user_id")]
        public Guid? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [Column("action")]
        public AuditAction Action { get; set; }

        [Required]
        [Column("entity_type")]
        public string EntityType { get; set; } = string.Empty;

        [Column("entity_id")]
        public Guid? EntityId { get; set; }

        [Column("old_values")]
        public string? OldValues { get; set; }

        [Column("new_values")]
        public string? NewValues { get; set; }

        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [Column("session_id")]
        public Guid? SessionId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("activity_flags")]
    public class ActivityFlag
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("task_id")]
        public Guid TaskId { get; set; }

        [ForeignKey("TaskId")]
        public ProjectTask Task { get; set; } = null!;

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        [Column("flag_type")]
        public string FlagType { get; set; } = string.Empty;

        [Column("reason")]
        public string? Reason { get; set; }

        [Column("is_resolved")]
        public bool IsResolved { get; set; } = false;

        [Column("resolved_by")]
        public Guid? ResolvedById { get; set; }

        [ForeignKey("ResolvedById")]
        public User? ResolvedBy { get; set; }

        [Column("resolved_at")]
        public DateTime? ResolvedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("productivity_metrics")]
    public class ProductivityMetric
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Column("project_id")]
        public Guid? ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        [Required]
        [Column("metric_date")]
        public DateTime MetricDate { get; set; }

        [Required]
        [Column("total_tasks_completed")]
        public int TotalTasksCompleted { get; set; } = 0;

        [Required]
        [Column("total_productive_minutes")]
        public int TotalProductiveMinutes { get; set; } = 0;

        [Required]
        [Column("total_tasks_assigned")]
        public int TotalTasksAssigned { get; set; } = 0;

        [Column("average_task_completion_hours", TypeName = "decimal(8, 2)")]
        public decimal? AverageTaskCompletionHours { get; set; }

        [Column("on_time_completion_rate", TypeName = "decimal(5, 2)")]
        public decimal? OnTimeCompletionRate { get; set; }

        [Required]
        [Column("revision_count")]
        public int RevisionCount { get; set; } = 0;

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; } = "{}";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
