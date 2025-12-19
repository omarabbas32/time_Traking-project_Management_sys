using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ems.Backend.Models
{
    [Table("user_sessions")]
    public class UserSession
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
        [Column("token_hash")]
        public string TokenHash { get; set; } = string.Empty;

        [Column("refresh_token_hash")]
        public string? RefreshTokenHash { get; set; }

        [Column("device_info", TypeName = "jsonb")]
        public string? DeviceInfo { get; set; }

        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [Column("is_valid")]
        public bool IsValid { get; set; } = true;

        [Required]
        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; }

        [Column("refresh_expires_at")]
        public DateTime? RefreshExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("last_used_at")]
        public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("project_members")]
    public class ProjectMember
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("project_id")]
        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("project_permissions")]
    public class ProjectPermission
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("project_id")]
        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Column("can_view")]
        public bool CanView { get; set; } = true;

        [Column("can_edit_project")]
        public bool CanEditProject { get; set; } = false;

        [Column("can_create_tasks")]
        public bool CanCreateTasks { get; set; } = false;

        [Column("can_assign_tasks")]
        public bool CanAssignTasks { get; set; } = false;

        [Column("can_upload_files")]
        public bool CanUploadFiles { get; set; } = false;

        [Column("can_manage_members")]
        public bool CanManageMembers { get; set; } = false;

        [Column("granted_by")]
        public Guid? GrantedById { get; set; }

        [ForeignKey("GrantedById")]
        public User? GrantedBy { get; set; }

        [Column("granted_at")]
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
