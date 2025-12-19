using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface ITasksService
    {
        Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(Guid projectId);
        Task<TaskDto> GetTaskByIdAsync(Guid id);
        Task<TaskDto> CreateTaskAsync(TaskCreateDto dto, Guid createdById);
        Task<TaskDto> UpdateTaskAsync(Guid id, TaskUpdateDto dto, Guid userId);
        Task<bool> DeleteTaskAsync(Guid id);
        Task<IEnumerable<TaskDto>> GetAssignedTasksAsync(Guid userId);
        Task<bool> UpdateTaskStatusAsync(Guid id, Models.TaskStatus status, Guid userId, string? notes = null);
    }
}
