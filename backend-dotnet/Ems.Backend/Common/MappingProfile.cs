using AutoMapper;
using Ems.Backend.DTOs;
using Ems.Backend.Models;

namespace Ems.Backend.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            
            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.MemberCount, opt => opt.MapFrom(src => src.Members.Count))
                .ForMember(dest => dest.TaskCount, opt => opt.MapFrom(src => src.Tasks.Count));

            CreateMap<ProjectTask, TaskDto>()
                .ForMember(dest => dest.SubTaskCount, opt => opt.MapFrom(src => src.SubTasks.Count))
                .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count));

            CreateMap<FileAttachment, FileDto>();

            CreateMap<Comment, CommentDto>();

            CreateMap<Notification, NotificationDto>();

            CreateMap<AppAuditLog, AuditLogDto>();
        }
    }
}
