using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JKTyre.Ticketing.Api.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        [Required, MaxLength(50)]
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        [Required, MaxLength(20)]
        public string DepartmentCode { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        public int DepartmentId { get; set; }
        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        public string? PlantLocation { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TicketCategory
    {
        [Key]
        public int CategoryId { get; set; }
        [Required, MaxLength(20)]
        public string CategoryCode { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SlaHours { get; set; } = 24;
        public bool IsActive { get; set; } = true;
    }

    public class Priority
    {
        [Key]
        public int PriorityId { get; set; }
        [Required, MaxLength(20)]
        public string PriorityName { get; set; } = string.Empty;
        public string ColorCode { get; set; } = "#6B7280";
        public int ResponseTimeHours { get; set; } = 8;
    }

    public class Status
    {
        [Key]
        public int StatusId { get; set; }
        [Required, MaxLength(50)]
        public string StatusName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsFinal { get; set; } = false;
    }

    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        [Required, MaxLength(30)]
        public string TicketNumber { get; set; } = string.Empty;
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public TicketCategory? Category { get; set; }

        public int PriorityId { get; set; }
        [ForeignKey("PriorityId")]
        public Priority? Priority { get; set; }

        public int DepartmentId { get; set; }
        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        public int StatusId { get; set; }
        [ForeignKey("StatusId")]
        public Status? Status { get; set; }

        public string Severity { get; set; } = "Medium";
        public string Location { get; set; } = string.Empty;
        public string? MachineNumber { get; set; }

        public int RaisedByUserId { get; set; }
        [ForeignKey("RaisedByUserId")]
        public User? RaisedByUser { get; set; }

        public int? AssignedToUserId { get; set; }
        [ForeignKey("AssignedToUserId")]
        public User? AssignedToUser { get; set; }

        public int? CurrentApproverId { get; set; }
        [ForeignKey("CurrentApproverId")]
        public User? CurrentApprover { get; set; }

        public DateTime? ExpectedCompletionDate { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class ApprovalHistory
    {
        [Key]
        public int ApprovalId { get; set; }
        public int TicketId { get; set; }
        public int ApproverId { get; set; }
        public string Action { get; set; } = string.Empty; // Approved, Rejected, RequestInfo
        public string? Comments { get; set; }
        public int? PreviousStatusId { get; set; }
        public int NewStatusId { get; set; }
        public DateTime ActionDate { get; set; } = DateTime.UtcNow;
    }

    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        public int TicketId { get; set; }
        public int UserId { get; set; }
        public string CommentText { get; set; } = string.Empty;
        public bool IsInternal { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public int? TicketId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "Info";
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AuditLog
    {
        [Key]
        public int AuditId { get; set; }
        public int? UserId { get; set; }
        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
