using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class CommentsService : ICommentsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<CommentsService> _logger;

        public CommentsService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<CommentsService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByTaskAsync(Guid taskId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.TaskId == taskId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, Guid userId)
        {
            var comment = new Comment
            {
                TaskId = dto.TaskId,
                UserId = userId,
                ParentCommentId = dto.ParentCommentId,
                Content = dto.Content,
                Mentions = dto.Mentions
            };

            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New comment created on task {TaskId} by {UserId}", dto.TaskId, userId);

            return await GetCommentDtoAsync(comment.Id);
        }

        public async Task<CommentDto> UpdateCommentAsync(Guid id, CommentUpdateDto dto, Guid userId)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null || comment.UserId != userId) return null!;

            comment.Content = dto.Content;
            comment.Mentions = dto.Mentions;
            comment.IsEdited = true;
            comment.EditedAt = DateTime.UtcNow;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetCommentDtoAsync(comment.Id);
        }

        public async Task<bool> DeleteCommentAsync(Guid id, Guid userId)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return false;

            // Check if user is the comment owner or an admin (simplified)
            if (comment.UserId != userId) return false;

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<CommentDto> GetCommentDtoAsync(Guid id)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
            return _mapper.Map<CommentDto>(comment);
        }
    }
}
