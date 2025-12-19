using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;
using System.Text.Json;

namespace Ems.Backend.Services
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<AuditService> _logger;

        public AuditService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<AuditService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task LogActivityAsync(AuditLogCreateDto dto)
        {
            var log = new AppAuditLog
            {
                UserId = dto.UserId,
                Action = dto.Action,
                EntityType = dto.EntityType,
                EntityId = dto.EntityId,
                OldValues = dto.OldData != null ? JsonSerializer.Serialize(dto.OldData) : "{}",
                NewValues = dto.NewData != null ? JsonSerializer.Serialize(dto.NewData) : "{}",
                IpAddress = dto.IpAddress ?? string.Empty,
                UserAgent = dto.UserAgent ?? string.Empty
            };

            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Audit log created: {Action} on {EntityType}:{EntityId} by {UserId}", 
                dto.Action, dto.EntityType, dto.EntityId, dto.UserId);
        }

        public async Task<IEnumerable<AuditLogDto>> GetEntityAuditLogsAsync(string entityType, Guid entityId)
        {
            var logs = await _context.AuditLogs
                .Include(a => a.User)
                .Where(a => a.EntityType == entityType && a.EntityId == entityId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditLogDto>>(logs);
        }

        public async Task<IEnumerable<AuditLogDto>> GetUserAuditLogsAsync(Guid userId)
        {
            var logs = await _context.AuditLogs
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditLogDto>>(logs);
        }
    }
}
