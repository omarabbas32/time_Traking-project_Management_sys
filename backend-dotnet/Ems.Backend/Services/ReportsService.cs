using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class ReportsService : IReportsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReportsService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProductivityReportDto> GetUserProductivityAsync(Guid userId, DateTime startDate, DateTime endDate)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var completedTasks = await _context.Tasks
                .Where(t => t.AssignedToId == userId && t.Status == Models.TaskStatus.Completed && t.CompletedAt >= startDate && t.CompletedAt <= endDate)
                .ToListAsync();

            var metrics = await _context.ProductivityMetrics
                .Where(m => m.UserId == userId && m.MetricDate >= startDate && m.MetricDate <= endDate)
                .OrderBy(m => m.MetricDate)
                .ToListAsync();

            var report = new ProductivityReportDto
            {
                UserId = userId,
                UserName = $"{user.FirstName} {user.LastName}",
                TasksCompleted = completedTasks.Count,
                TotalHoursWorked = metrics.Sum(m => m.TotalProductiveMinutes) / 60m,
                AverageTaskDuration = completedTasks.Any() ? metrics.Sum(m => m.TotalProductiveMinutes) / 60m / completedTasks.Count : 0,
                EfficiencyScore = metrics.Any() ? metrics.Average(m => (decimal)(m.OnTimeCompletionRate ?? 0)) : 0, // Using OnTimeCompletionRate as a proxy for efficiency score if EfficiencyScore is missing
                DailyMetrics = metrics.Select(m => new DailyMetricDto
                {
                    Date = m.MetricDate,
                    HoursWorked = m.TotalProductiveMinutes / 60m,
                    TasksCompleted = m.TotalTasksCompleted
                }).ToList()
            };

            return report;
        }

        public async Task<IEnumerable<ProjectSummaryDto>> GetAdminProjectSummariesAsync()
        {
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Members)
                .ToListAsync();

            return projects.Select(p => new ProjectSummaryDto
            {
                ProjectId = p.Id,
                Name = p.Name,
                TotalTasks = p.Tasks.Count,
                CompletedTasks = p.Tasks.Count(t => t.Status == Models.TaskStatus.Completed),
                MemberCount = p.Members.Count,
                CreatedAt = p.CreatedAt
            });
        }
    }
}
