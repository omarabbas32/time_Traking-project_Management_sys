using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface IProjectsService
    {
        Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(bool includeArchived = false);
        Task<ProjectDto> GetProjectByIdAsync(Guid id);
        Task<ProjectDto> CreateProjectAsync(ProjectCreateDto dto, Guid ownerId);
        Task<ProjectDto> UpdateProjectAsync(Guid id, ProjectUpdateDto dto);
        Task<bool> DeleteProjectAsync(Guid id);
        Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(Guid userId);
    }
}
