using System;
using System.ComponentModel.DataAnnotations;

namespace Ems.Backend.DTOs
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public UserDto User { get; set; } = null!;
        public Guid? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsEdited { get; set; }
        public DateTime? EditedAt { get; set; }
        public Guid[] Mentions { get; set; } = Array.Empty<Guid>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CommentCreateDto
    {
        [Required]
        public Guid TaskId { get; set; }
        public Guid? ParentCommentId { get; set; }
        [Required]
        public string Content { get; set; } = string.Empty;
        public Guid[] Mentions { get; set; } = Array.Empty<Guid>();
    }

    public class CommentUpdateDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;
        public Guid[] Mentions { get; set; } = Array.Empty<Guid>();
    }
}
