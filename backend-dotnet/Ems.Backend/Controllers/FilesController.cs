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
    public class FilesController : ControllerBase
    {
        private readonly IFilesService _filesService;

        public FilesController(IFilesService filesService)
        {
            _filesService = filesService;
        }

        [HttpPost("upload-url")]
        public async Task<ActionResult<UploadUrlResponse>> RequestUploadUrl([FromBody] RequestUploadUrlDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var response = await _filesService.GenerateUploadUrlAsync(dto, userId);
            return Ok(response);
        }

        [HttpPost("confirm/{projectId}")]
        public async Task<ActionResult<FileDto>> ConfirmUpload(Guid projectId, [FromBody] ConfirmUploadDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            try
            {
                var file = await _filesService.ConfirmUploadAsync(projectId, dto, userId);
                return Ok(file);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}/download")]
        public async Task<ActionResult<object>> GetDownloadUrl(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var url = await _filesService.GenerateDownloadUrlAsync(id, userId);
            return Ok(new { downloadUrl = url });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _filesService.DeleteFileAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<FileDto>>> GetProjectFiles(Guid projectId)
        {
            var files = await _filesService.GetProjectFilesAsync(projectId);
            return Ok(files);
        }
    }
}
