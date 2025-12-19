using Amazon.S3;
using Amazon.S3.Model;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ems.Backend.Data;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Services
{
    public class FilesService : IFilesService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<FilesService> _logger;
        private readonly string _bucketName;

        public FilesService(
            ApplicationDbContext context,
            IAmazonS3 s3Client,
            IConfiguration configuration,
            IMapper mapper,
            ILogger<FilesService> logger)
        {
            _context = context;
            _s3Client = s3Client;
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
            _bucketName = _configuration["CloudflareR2:BucketName"] ?? "employee-management";
        }

        public async Task<UploadUrlResponse> GenerateUploadUrlAsync(RequestUploadUrlDto dto, Guid userId)
        {
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null) throw new KeyNotFoundException("Project not found");

            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var fileKey = $"projects/{dto.ProjectId}/{(dto.TaskId.HasValue ? $"tasks/{dto.TaskId}/" : "")}{timestamp}_{dto.FileName}";

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(15),
                ContentType = dto.ContentType
            };

            var url = _s3Client.GetPreSignedURL(request);

            return new UploadUrlResponse
            {
                UploadUrl = url,
                FileKey = fileKey,
                ExpiresAt = request.Expires
            };
        }

        public async Task<FileDto> ConfirmUploadAsync(Guid projectId, ConfirmUploadDto dto, Guid userId)
        {
            // Verify file exists in S3/R2
            try
            {
                await _s3Client.GetObjectMetadataAsync(_bucketName, dto.FileKey);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new InvalidOperationException("File not found in storage");
            }

            var metadata = await _s3Client.GetObjectMetadataAsync(_bucketName, dto.FileKey);

            var file = new FileAttachment
            {
                ProjectId = projectId,
                TaskId = dto.TaskId,
                UploadedById = userId,
                FileName = dto.FileKey.Split('/').Last(),
                OriginalName = dto.OriginalName,
                FilePath = dto.FileKey,
                FileSize = metadata.ContentLength,
                MimeType = metadata.Headers.ContentType,
                FileExtension = Path.GetExtension(dto.OriginalName).TrimStart('.').ToLower()
            };

            await _context.Files.AddAsync(file);
            await _context.SaveChangesAsync();

            _logger.LogInformation("File upload confirmed: {FileId} for project {ProjectId}", file.Id, projectId);

            return await GetFileDtoAsync(file.Id);
        }

        public async Task<string> GenerateDownloadUrlAsync(Guid fileId, Guid userId)
        {
            var file = await _context.Files.FindAsync(fileId);
            if (file == null) throw new KeyNotFoundException("File not found");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = file.FilePath,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<bool> DeleteFileAsync(Guid fileId, Guid userId)
        {
            var file = await _context.Files.FindAsync(fileId);
            if (file == null) return false;

            // Delete from R2
            await _s3Client.DeleteObjectAsync(_bucketName, file.FilePath);

            // Delete from DB
            _context.Files.Remove(file);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FileDto>> GetProjectFilesAsync(Guid projectId)
        {
            var files = await _context.Files
                .Include(f => f.UploadedBy)
                .Where(f => f.ProjectId == projectId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<FileDto>>(files);
        }

        private async Task<FileDto> GetFileDtoAsync(Guid id)
        {
            var file = await _context.Files
                .Include(f => f.UploadedBy)
                .FirstOrDefaultAsync(f => f.Id == id);
            return _mapper.Map<FileDto>(file);
        }
    }
}
