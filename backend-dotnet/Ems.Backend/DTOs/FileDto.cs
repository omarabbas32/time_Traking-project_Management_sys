using System;
using System.ComponentModel.DataAnnotations;

namespace Ems.Backend.DTOs
{
    public class FileDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid? TaskId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string OriginalName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string MimeType { get; set; } = string.Empty;
        public UserDto UploadedBy { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class RequestUploadUrlDto
    {
        [Required]
        public Guid ProjectId { get; set; }
        public Guid? TaskId { get; set; }
        [Required]
        public string FileName { get; set; } = string.Empty;
        [Required]
        public string ContentType { get; set; } = string.Empty;
        [Required]
        public long FileSize { get; set; }
    }

    public class UploadUrlResponse
    {
        public string UploadUrl { get; set; } = string.Empty;
        public string FileKey { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    public class ConfirmUploadDto
    {
        [Required]
        public string FileKey { get; set; } = string.Empty;
        [Required]
        public string OriginalName { get; set; } = string.Empty;
        public Guid? TaskId { get; set; }
    }
}
