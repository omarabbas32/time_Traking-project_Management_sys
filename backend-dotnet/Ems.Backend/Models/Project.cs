using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ems.Backend.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("status")]
        public ProjectStatus Status { get; set; } = ProjectStatus.Planning;

        [Required]
        [Column("owner_id")]
        public Guid OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public User Owner { get; set; } = null!;

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("target_end_date")]
        public DateTime? TargetEndDate { get; set; }

        [Column("actual_end_date")]
        public DateTime? ActualEndDate { get; set; }

        [Column("budget", TypeName = "decimal(15, 2)")]
        public decimal? Budget { get; set; }

        [Column("is_archived")]
        public bool IsArchived { get; set; } = false;

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; } = "{}";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
        public ICollection<ProjectPermission> Permissions { get; set; } = new List<ProjectPermission>();
        public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
        public ICollection<FileAttachment> Files { get; set; } = new List<FileAttachment>();
    }
}
