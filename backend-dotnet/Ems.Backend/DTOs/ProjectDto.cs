using System;
using System.ComponentModel.DataAnnotations;
using Ems.Backend.Models;

namespace Ems.Backend.DTOs
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProjectStatus Status { get; set; }
        public Guid OwnerId { get; set; }
        public UserDto Owner { get; set; } = null!;
        public DateTime? StartDate { get; set; }
        public DateTime? TargetEndDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public decimal? Budget { get; set; }
        public bool IsArchived { get; set; }
        public string Metadata { get; set; } = "{}";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int MemberCount { get; set; }
        public int TaskCount { get; set; }
    }

    public class ProjectCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
        public DateTime? StartDate { get; set; }
        public DateTime? TargetEndDate { get; set; }
        public decimal? Budget { get; set; }
        public string Metadata { get; set; } = "{}";
    }

    public class ProjectUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public ProjectStatus? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? TargetEndDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public decimal? Budget { get; set; }
        public bool? IsArchived { get; set; }
        public string? Metadata { get; set; }
    }
}
