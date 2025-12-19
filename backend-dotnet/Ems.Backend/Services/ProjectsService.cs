using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class ProjectsService : IProjectsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ProjectsService> _logger;

        public ProjectsService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<ProjectsService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(bool includeArchived = false)
        {
            var query = _context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Members)
                .Include(p => p.Tasks)
                .AsQueryable();

            if (!includeArchived)
            {
                query = query.Where(p => !p.IsArchived);
            }

            var projects = await query.ToListAsync();
            return _mapper.Map<IEnumerable<ProjectDto>>(projects);
        }

        public async Task<ProjectDto> GetProjectByIdAsync(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Members)
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return null!;
            return _mapper.Map<ProjectDto>(project);
        }

        public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto dto, Guid ownerId)
        {
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = dto.Status,
                OwnerId = ownerId,
                StartDate = dto.StartDate,
                TargetEndDate = dto.TargetEndDate,
                Budget = dto.Budget,
                Metadata = dto.Metadata
            };

            await _context.Projects.AddAsync(project);
            
            // Add owner as a project member with all permissions
            var member = new ProjectMember
            {
                ProjectId = project.Id,
                UserId = ownerId,
                JoinedAt = DateTime.UtcNow
            };
            await _context.ProjectMembers.AddAsync(member);

            var permission = new ProjectPermission
            {
                ProjectId = project.Id,
                UserId = ownerId,
                CanView = true,
                CanEditProject = true,
                CanCreateTasks = true,
                CanAssignTasks = true,
                CanUploadFiles = true,
                CanManageMembers = true,
                GrantedAt = DateTime.UtcNow
            };
            await _context.ProjectPermissions.AddAsync(permission);

            await _context.SaveChangesAsync();
            _logger.LogInformation("New project created: {ProjectName} by {OwnerId}", project.Name, ownerId);

            return await GetProjectByIdAsync(project.Id);
        }

        public async Task<ProjectDto> UpdateProjectAsync(Guid id, ProjectUpdateDto dto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return null!;

            if (dto.Name != null) project.Name = dto.Name;
            if (dto.Description != null) project.Description = dto.Description;
            if (dto.Status.HasValue) project.Status = dto.Status.Value;
            if (dto.StartDate.HasValue) project.StartDate = dto.StartDate;
            if (dto.TargetEndDate.HasValue) project.TargetEndDate = dto.TargetEndDate;
            if (dto.ActualEndDate.HasValue) project.ActualEndDate = dto.ActualEndDate;
            if (dto.Budget.HasValue) project.Budget = dto.Budget;
            if (dto.IsArchived.HasValue) project.IsArchived = dto.IsArchived.Value;
            if (dto.Metadata != null) project.Metadata = dto.Metadata;

            project.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetProjectByIdAsync(project.Id);
        }

        public async Task<bool> DeleteProjectAsync(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(Guid userId)
        {
            var projectIds = await _context.ProjectMembers
                .Where(pm => pm.UserId == userId && pm.IsActive)
                .Select(pm => pm.ProjectId)
                .ToListAsync();

            var projects = await _context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Members)
                .Include(p => p.Tasks)
                .Where(p => projectIds.Contains(p.Id) || p.OwnerId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ProjectDto>>(projects);
        }
    }
}
