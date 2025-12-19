using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ems.Backend.DTOs;
using Ems.Backend.Services;

namespace Ems.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpGet("entity/{type}/{id}")]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetEntityLogs(string type, Guid id)
        {
            var logs = await _auditService.GetEntityAuditLogsAsync(type, id);
            return Ok(logs);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetUserLogs(Guid userId)
        {
            var logs = await _auditService.GetUserAuditLogsAsync(userId);
            return Ok(logs);
        }
    }
}
