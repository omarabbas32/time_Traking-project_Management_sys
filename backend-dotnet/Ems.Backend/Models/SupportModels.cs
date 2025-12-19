using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ems.Backend.Models
{
    [Table("task_status_logs")]
    public class TaskStatusLog
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

        [Column("previous_status")]
        public TaskStatus? PreviousStatus { get; set; }

        [Required]
        [Column("new_status")]
        public TaskStatus NewStatus { get; set; }

        [Column("started_at")]
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        [Column("ended_at")]
        public DateTime? EndedAt { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("files")]
    public class FileAttachment
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("project_id")]
        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [Column("task_id")]
        public Guid? TaskId { get; set; }

        [ForeignKey("TaskId")]
        public ProjectTask? Task { get; set; }

        [Required]
        [Column("uploaded_by")]
        public Guid UploadedById { get; set; }

        [ForeignKey("UploadedById")]
        public User UploadedBy { get; set; } = null!;

        [Required]
        [Column("file_name")]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [Column("original_name")]
        public string OriginalName { get; set; } = string.Empty;

        [Required]
        [Column("file_path")]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        [Column("file_size")]
        public long FileSize { get; set; }

        [Required]
        [Column("mime_type")]
        public string MimeType { get; set; } = string.Empty;

        [Column("file_extension")]
        public string? FileExtension { get; set; }

        [Column("checksum")]
        public string? Checksum { get; set; }

        [Column("is_public")]
        public bool IsPublic { get; set; } = false;

        [Column("version")]
        public int Version { get; set; } = 1;

        [Column("parent_file_id")]
        public Guid? ParentFileId { get; set; }

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; } = "{}";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("comments")]
    public class Comment
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

        [Column("parent_comment_id")]
        public Guid? ParentCommentId { get; set; }

        [ForeignKey("ParentCommentId")]
        public Comment? ParentComment { get; set; }

        [Required]
        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Column("is_edited")]
        public bool IsEdited { get; set; } = false;

        [Column("edited_at")]
        public DateTime? EditedAt { get; set; }

        [Column("mentions")]
        public Guid[] Mentions { get; set; } = Array.Empty<Guid>();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
