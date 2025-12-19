using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ems.Backend.Models
{
    [Table("tasks")]
    public class ProjectTask
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("project_id")]
        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [Column("parent_task_id")]
        public Guid? ParentTaskId { get; set; }

        [ForeignKey("ParentTaskId")]
        public ProjectTask? ParentTask { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("status")]
        public TaskStatus Status { get; set; } = TaskStatus.Pending;

        [Required]
        [Column("priority")]
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [Column("assigned_to")]
        public Guid? AssignedToId { get; set; }

        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }

        [Required]
        [Column("created_by")]
        public Guid CreatedById { get; set; }

        [ForeignKey("CreatedById")]
        public User CreatedBy { get; set; } = null!;

        [Column("estimated_hours", TypeName = "decimal(8, 2)")]
        public decimal? EstimatedHours { get; set; }

        [Column("actual_hours", TypeName = "decimal(8, 2)")]
        public decimal? ActualHours { get; set; }

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("due_date")]
        public DateTime? DueDate { get; set; }

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        [Column("order_index")]
        public int OrderIndex { get; set; } = 0;

        [Column("tags")]
        public string[] Tags { get; set; } = Array.Empty<string>();

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; } = "{}";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<ProjectTask> SubTasks { get; set; } = new List<ProjectTask>();
        public ICollection<TaskStatusLog> StatusLogs { get; set; } = new List<TaskStatusLog>();
        public ICollection<FileAttachment> Files { get; set; } = new List<FileAttachment>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
