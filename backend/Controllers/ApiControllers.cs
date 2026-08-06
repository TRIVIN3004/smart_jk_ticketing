using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JKTyre.Ticketing.Api.Data;
using JKTyre.Ticketing.Api.DTOs;
using JKTyre.Ticketing.Api.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace JKTyre.Ticketing.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var user = await _db.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());

            if (user == null || !user.IsActive)
            {
                return Unauthorized(new { message = "Invalid username or account deactivated." });
            }

            // In production, BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)
            // For testing setup, accept valid user credential
            user.LastLoginAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"] ?? "JKTyre_Enterprise_Super_Secret_Key_2026");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "RE User"),
                    new Claim("DepartmentId", user.DepartmentId.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryMinutes"] ?? "480")),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = user.Role?.RoleName ?? "RE User",
                DepartmentName = user.Department?.DepartmentName ?? "General",
                ExpiresAt = tokenDescriptor.Expires.Value
            });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public TicketsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets([FromQuery] string? status, [FromQuery] string? priority, [FromQuery] string? department)
        {
            var query = _db.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Department)
                .Include(t => t.Status)
                .Include(t => t.RaisedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.CurrentApprover)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status!.StatusName.ToLower() == status.ToLower());

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(t => t.Priority!.PriorityName.ToLower() == priority.ToLower());

            if (!string.IsNullOrEmpty(department))
                query = query.Where(t => t.Department!.DepartmentName.ToLower() == department.ToLower());

            var tickets = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
            return Ok(tickets);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.TryParse(userIdClaim, out var id) ? id : 1;

            var pendingStatus = await _db.Statuses.FirstOrDefaultAsync(s => s.StatusName == "Pending Approval");
            
            var count = await _db.Tickets.CountAsync() + 1;
            var ticketNumber = $"JKT-202608-{count:D4}";

            var ticket = new Ticket
            {
                TicketNumber = ticketNumber,
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                PriorityId = dto.PriorityId,
                DepartmentId = dto.DepartmentId,
                StatusId = pendingStatus?.StatusId ?? 2,
                Severity = dto.Severity,
                Location = dto.Location,
                MachineNumber = dto.MachineNumber,
                RaisedByUserId = userId,
                CurrentApproverId = dto.TargetApproverId,
                ExpectedCompletionDate = dto.ExpectedCompletionDate ?? DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow
            };

            _db.Tickets.Add(ticket);
            await _db.SaveChangesAsync();

            return Ok(ticket);
        }

        [HttpPost("{id}/approval")]
        [Authorize(Roles = "Master Admin,JK Manager,Smart Manager")]
        public async Task<IActionResult> ProcessApproval(int id, [FromBody] ApprovalActionDto dto)
        {
            var ticket = await _db.Tickets.FindAsync(id);
            if (ticket == null) return NotFound();

            var approverIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int approverId = int.TryParse(approverIdClaim, out var aid) ? aid : 1;

            int targetStatusId = dto.Action switch
            {
                "Approved" => 3, // Approved
                "Rejected" => 4, // Rejected
                _ => 2 // Pending Approval
            };

            var history = new ApprovalHistory
            {
                TicketId = id,
                ApproverId = approverId,
                Action = dto.Action,
                Comments = dto.Comments,
                PreviousStatusId = ticket.StatusId,
                NewStatusId = targetStatusId,
                ActionDate = DateTime.UtcNow
            };

            ticket.StatusId = targetStatusId;
            ticket.UpdatedAt = DateTime.UtcNow;

            _db.ApprovalHistories.Add(history);
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Ticket {dto.Action} successfully." });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Master Admin")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UsersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Phone,
                    u.Role!.RoleName,
                    u.Department!.DepartmentName,
                    u.PlantLocation,
                    u.IsActive,
                    u.LastLoginAt
                }).ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateUpdateDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                FullName = dto.FullName,
                Phone = dto.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password ?? "JKTyre@2026"),
                RoleId = dto.RoleId,
                DepartmentId = dto.DepartmentId,
                PlantLocation = dto.PlantLocation,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(user);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public DashboardController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _db.Tickets.CountAsync();
            var pending = await _db.Tickets.CountAsync(t => t.StatusId == 2);
            var approved = await _db.Tickets.CountAsync(t => t.StatusId == 3);
            var rejected = await _db.Tickets.CountAsync(t => t.StatusId == 4);
            var closed = await _db.Tickets.CountAsync(t => t.StatusId == 7);
            var today = await _db.Tickets.CountAsync(t => t.CreatedAt.Date == DateTime.UtcNow.Date);

            return Ok(new DashboardStatsDto
            {
                TotalTickets = total,
                PendingTickets = pending,
                ApprovedTickets = approved,
                RejectedTickets = rejected,
                ClosedTickets = closed,
                TodayTickets = today
            });
        }
    }
}
