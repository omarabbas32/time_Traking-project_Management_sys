using System;

namespace Ems.Backend.DTOs
{
    public class ProductivityReportDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int TasksCompleted { get; set; }
        public decimal TotalHoursWorked { get; set; }
        public decimal AverageTaskDuration { get; set; }
        public decimal EfficiencyScore { get; set; }
        public List<DailyMetricDto> DailyMetrics { get; set; } = new List<DailyMetricDto>();
    }

    public class DailyMetricDto
    {
        public DateTime Date { get; set; }
        public decimal HoursWorked { get; set; }
        public int TasksCompleted { get; set; }
    }

    public class ProjectSummaryDto
    {
        public Guid ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public decimal CompletionPercentage => TotalTasks > 0 ? (decimal)CompletedTasks / TotalTasks * 100 : 0;
        public int MemberCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
