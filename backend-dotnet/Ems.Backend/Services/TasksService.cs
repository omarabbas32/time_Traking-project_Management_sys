using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class TasksService : ITasksService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<TasksService> _logger;

        public TasksService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<TasksService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(Guid projectId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.SubTasks)
                .Include(t => t.Comments)
                .Where(t => t.ProjectId == projectId && t.ParentTaskId == null)
                .OrderBy(t => t.OrderIndex)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<TaskDto> GetTaskByIdAsync(Guid id)
        {
            var task = await _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.SubTasks)
                .Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return null!;
            return _mapper.Map<TaskDto>(task);
        }

        public async Task<TaskDto> CreateTaskAsync(TaskCreateDto dto, Guid createdById)
        {
            var task = new ProjectTask
            {
                ProjectId = dto.ProjectId,
                ParentTaskId = dto.ParentTaskId,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                AssignedToId = dto.AssignedToId,
                CreatedById = createdById,
                EstimatedHours = dto.EstimatedHours,
                StartDate = dto.StartDate,
                DueDate = dto.DueDate,
                Tags = dto.Tags,
                Metadata = dto.Metadata
            };

            await _context.Tasks.AddAsync(task);

            // Log status change
            var log = new TaskStatusLog
            {
                TaskId = task.Id,
                UserId = createdById,
                NewStatus = dto.Status,
                CreatedAt = DateTime.UtcNow
            };
            await _context.TaskStatusLogs.AddAsync(log);

            await _context.SaveChangesAsync();
            _logger.LogInformation("New task created: {TaskTitle} in project {ProjectId}", task.Title, task.ProjectId);

            return await GetTaskByIdAsync(task.Id);
        }

        public async Task<TaskDto> UpdateTaskAsync(Guid id, TaskUpdateDto dto, Guid userId)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null!;

            var previousStatus = task.Status;

            if (dto.Title != null) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (dto.Status.HasValue) task.Status = dto.Status.Value;
            if (dto.Priority.HasValue) task.Priority = dto.Priority.Value;
            if (dto.AssignedToId.HasValue) task.AssignedToId = dto.AssignedToId;
            if (dto.EstimatedHours.HasValue) task.EstimatedHours = dto.EstimatedHours;
            if (dto.ActualHours.HasValue) task.ActualHours = dto.ActualHours;
            if (dto.StartDate.HasValue) task.StartDate = dto.StartDate;
            if (dto.DueDate.HasValue) task.DueDate = dto.DueDate;
            if (dto.Tags != null) task.Tags = dto.Tags;
            if (dto.Metadata != null) task.Metadata = dto.Metadata;

            if (task.Status == Models.TaskStatus.Completed && previousStatus != Models.TaskStatus.Completed)
            {
                task.CompletedAt = DateTime.UtcNow;
            }

            if (dto.Status.HasValue && dto.Status.Value != previousStatus)
            {
                var log = new TaskStatusLog
                {
                    TaskId = task.Id,
                    UserId = userId,
                    PreviousStatus = previousStatus,
                    NewStatus = dto.Status.Value,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.TaskStatusLogs.AddAsync(log);
            }

            task.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetTaskByIdAsync(task.Id);
        }

        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TaskDto>> GetAssignedTasksAsync(Guid userId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.CreatedBy)
                .Where(t => t.AssignedToId == userId && t.Status != Models.TaskStatus.Completed)
                .OrderBy(t => t.DueDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<bool> UpdateTaskStatusAsync(Guid id, Models.TaskStatus status, Guid userId, string? notes = null)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            var previousStatus = task.Status;
            if (previousStatus == status) return true;

            task.Status = status;
            if (status == Models.TaskStatus.Completed)
            {
                task.CompletedAt = DateTime.UtcNow;
            }

            var log = new TaskStatusLog
            {
                TaskId = task.Id,
                UserId = userId,
                PreviousStatus = previousStatus,
                NewStatus = status,
                Notes = notes,
                CreatedAt = DateTime.UtcNow
            };
            await _context.TaskStatusLogs.AddAsync(log);

            task.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
