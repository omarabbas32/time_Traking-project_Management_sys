using Microsoft.EntityFrameworkCore;
using Ems.Backend.Models;

namespace Ems.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }
        public DbSet<ProjectPermission> ProjectPermissions { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }
        public DbSet<TaskStatusLog> TaskStatusLogs { get; set; }
        public DbSet<FileAttachment> Files { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AppAuditLog> AuditLogs { get; set; }
        public DbSet<ActivityFlag> ActivityFlags { get; set; }
        public DbSet<ProductivityMetric> ProductivityMetrics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Enums to be stored as strings in PostgreSQL
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Project>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectTask>()
                .Property(t => t.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectTask>()
                .Property(t => t.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<TaskStatusLog>()
                .Property(l => l.PreviousStatus)
                .HasConversion<string>();

            modelBuilder.Entity<TaskStatusLog>()
                .Property(l => l.NewStatus)
                .HasConversion<string>();

            // Configure JSONB columns
            modelBuilder.Entity<Project>()
                .Property(p => p.Metadata)
                .HasColumnType("jsonb");

            modelBuilder.Entity<ProjectTask>()
                .Property(t => t.Metadata)
                .HasColumnType("jsonb");

            modelBuilder.Entity<UserSession>()
                .Property(s => s.DeviceInfo)
                .HasColumnType("jsonb");

            // Configure Table relationships and behavioral constraints
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.OwnedProjects)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.AssignedTo)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.CreatedBy)
                .WithMany(u => u.CreatedTasks)
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
