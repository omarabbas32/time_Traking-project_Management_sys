using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Ems.Backend.Models;

namespace Ems.Backend.DTOs
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid? ParentTaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Ems.Backend.Models.TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public Guid? AssignedToId { get; set; }
        public UserDto? AssignedTo { get; set; }
        public Guid CreatedById { get; set; }
        public UserDto CreatedBy { get; set; } = null!;
        public decimal? EstimatedHours { get; set; }
        public decimal? ActualHours { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int OrderIndex { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();
        public string Metadata { get; set; } = "{}";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int SubTaskCount { get; set; }
        public int CommentCount { get; set; }
        public List<TaskDto> SubTasks { get; set; } = new List<TaskDto>();
    }

    public class TaskCreateDto
    {
        [Required]
        public Guid ProjectId { get; set; }
        public Guid? ParentTaskId { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Ems.Backend.Models.TaskStatus Status { get; set; } = Models.TaskStatus.Pending;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public Guid? AssignedToId { get; set; }
        public decimal? EstimatedHours { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();
        public string Metadata { get; set; } = "{}";
    }

    public class TaskUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public Ems.Backend.Models.TaskStatus? Status { get; set; }
        public TaskPriority? Priority { get; set; }
        public Guid? AssignedToId { get; set; }
        public decimal? EstimatedHours { get; set; }
        public decimal? ActualHours { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string[] Tags { get; set; }
        public string? Metadata { get; set; }
    }
}
