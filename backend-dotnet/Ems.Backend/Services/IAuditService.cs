using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface IAuditService
    {
        Task LogActivityAsync(AuditLogCreateDto dto);
        Task<IEnumerable<AuditLogDto>> GetEntityAuditLogsAsync(string entityType, Guid entityId);
        Task<IEnumerable<AuditLogDto>> GetUserAuditLogsAsync(Guid userId);
    }
}
