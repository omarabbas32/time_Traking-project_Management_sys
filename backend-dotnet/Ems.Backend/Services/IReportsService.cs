using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface IReportsService
    {
        Task<ProductivityReportDto> GetUserProductivityAsync(Guid userId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<ProjectSummaryDto>> GetAdminProjectSummariesAsync();
    }
}
