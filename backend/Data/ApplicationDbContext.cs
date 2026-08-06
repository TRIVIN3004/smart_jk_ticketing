using Microsoft.EntityFrameworkCore;
using JKTyre.Ticketing.Api.Models;

namespace JKTyre.Ticketing.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<TicketCategory> TicketCategories => Set<TicketCategory>();
        public DbSet<Priority> Priorities => Set<Priority>();
        public DbSet<Status> Statuses => Set<Status>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<ApprovalHistory> ApprovalHistories => Set<ApprovalHistory>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.TicketNumber)
                .IsUnique();
        }
    }
}
