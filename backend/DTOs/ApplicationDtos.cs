namespace JKTyre.Ticketing.Api.DTOs
{
    public class LoginRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SelectedRole { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    public class CreateTicketDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int PriorityId { get; set; }
        public int DepartmentId { get; set; }
        public int? TargetApproverId { get; set; }
        public string Severity { get; set; } = "Medium";
        public string Location { get; set; } = string.Empty;
        public string? MachineNumber { get; set; }
        public DateTime? ExpectedCompletionDate { get; set; }
    }

    public class ApprovalActionDto
    {
        public int TicketId { get; set; }
        public string Action { get; set; } = string.Empty; // Approved, Rejected, RequestInfo
        public string Comments { get; set; } = string.Empty;
        public int? ReassignToUserId { get; set; }
    }

    public class UserCreateUpdateDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public int RoleId { get; set; }
        public int DepartmentId { get; set; }
        public string? PlantLocation { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class DashboardStatsDto
    {
        public int TotalTickets { get; set; }
        public int PendingTickets { get; set; }
        public int ApprovedTickets { get; set; }
        public int RejectedTickets { get; set; }
        public int ClosedTickets { get; set; }
        public int TodayTickets { get; set; }
        public List<DepartmentMetricDto> DepartmentBreakdown { get; set; } = new();
        public List<PriorityMetricDto> PriorityBreakdown { get; set; } = new();
    }

    public class DepartmentMetricDto
    {
        public string DepartmentName { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class PriorityMetricDto
    {
        public string PriorityName { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
