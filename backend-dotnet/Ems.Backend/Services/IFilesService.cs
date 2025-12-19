using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface IFilesService
    {
        Task<UploadUrlResponse> GenerateUploadUrlAsync(RequestUploadUrlDto dto, Guid userId);
        Task<FileDto> ConfirmUploadAsync(Guid projectId, ConfirmUploadDto dto, Guid userId);
        Task<string> GenerateDownloadUrlAsync(Guid fileId, Guid userId);
        Task<bool> DeleteFileAsync(Guid fileId, Guid userId);
        Task<IEnumerable<FileDto>> GetProjectFilesAsync(Guid projectId);
    }
}
