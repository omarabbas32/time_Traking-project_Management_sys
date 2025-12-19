using Ems.Backend.DTOs;

namespace Ems.Backend.Services
{
    public interface ICommentsService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByTaskAsync(Guid taskId);
        Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, Guid userId);
        Task<CommentDto> UpdateCommentAsync(Guid id, CommentUpdateDto dto, Guid userId);
        Task<bool> DeleteCommentAsync(Guid id, Guid userId);
    }
}
