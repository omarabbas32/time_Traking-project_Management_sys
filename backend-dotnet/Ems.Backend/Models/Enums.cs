namespace Ems.Backend.Models
{
    public enum UserRole
    {
        Admin,
        Manager,
        ContentCreator,
        Designer,
        VideoEditor,
        MediaBuyer
    }

    public enum ProjectStatus
    {
        Planning,
        Active,
        OnHold,
        Completed,
        Archived
    }

    public enum TaskStatus
    {
        Pending,
        InProgress,
        OnHold,
        InReview,
        Revisions,
        Completed,
        Cancelled
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Urgent
    }

    public enum NotificationType
    {
        TaskAssigned,
        TaskUpdated,
        TaskCompleted,
        CommentAdded,
        Mention,
        DeadlineReminder,
        ProjectUpdate,
        PermissionGranted,
        FileUploaded
    }

    public enum AuditAction
    {
        Create,
        Update,
        Delete,
        Login,
        Logout,
        PermissionChange,
        StatusChange,
        FileUpload,
        FileDelete
    }
}
