using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ems.Backend.DTOs;
using Ems.Backend.Services;
using System.Security.Claims;

namespace Ems.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        [HttpGet("productivity")]
        public async Task<ActionResult<ProductivityReportDto>> GetMyProductivity([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            var report = await _reportsService.GetUserProductivityAsync(userId, start, end);
            return Ok(report);
        }

        [HttpGet("admin/projects")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ProjectSummaryDto>>> GetProjectSummaries()
        {
            var summaries = await _reportsService.GetAdminProjectSummariesAsync();
            return Ok(summaries);
        }
    }
}
