-- ====================================================================================
-- JK Tyre Smart Ticket Management & Approval System - Database Schema (SQL Server)
-- Compatible with SQL Server 2019 / 2022 / SQL Express / Azure SQL
-- ====================================================================================

USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'JKTyre_TicketingDB')
BEGIN
    CREATE DATABASE JKTyre_TicketingDB;
END
GO

USE JKTyre_TicketingDB;
GO

-- ====================================================================================
-- 1. DROP EXISTING TABLES (If re-running script)
-- ====================================================================================
IF OBJECT_ID('dbo.ActivityLogs', 'U') IS NOT NULL DROP TABLE dbo.ActivityLogs;
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
IF OBJECT_ID('dbo.LoginHistory', 'U') IS NOT NULL DROP TABLE dbo.LoginHistory;
IF OBJECT_ID('dbo.Notifications', 'U') IS NOT NULL DROP TABLE dbo.Notifications;
IF OBJECT_ID('dbo.Attachments', 'U') IS NOT NULL DROP TABLE dbo.Attachments;
IF OBJECT_ID('dbo.Comments', 'U') IS NOT NULL DROP TABLE dbo.Comments;
IF OBJECT_ID('dbo.ApprovalHistory', 'U') IS NOT NULL DROP TABLE dbo.ApprovalHistory;
IF OBJECT_ID('dbo.Tickets', 'U') IS NOT NULL DROP TABLE dbo.Tickets;
IF OBJECT_ID('dbo.Statuses', 'U') IS NOT NULL DROP TABLE dbo.Statuses;
IF OBJECT_ID('dbo.Priorities', 'U') IS NOT NULL DROP TABLE dbo.Priorities;
IF OBJECT_ID('dbo.TicketCategories', 'U') IS NOT NULL DROP TABLE dbo.TicketCategories;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
IF OBJECT_ID('dbo.Departments', 'U') IS NOT NULL DROP TABLE dbo.Departments;
IF OBJECT_ID('dbo.Roles', 'U') IS NOT NULL DROP TABLE dbo.Roles;
GO

-- ====================================================================================
-- 2. LOOKUP & CORE SYSTEM TABLES
-- ====================================================================================

-- Roles Table
CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Departments Table
CREATE TABLE dbo.Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentCode NVARCHAR(20) NOT NULL UNIQUE,
    DepartmentName NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Users Table
CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NULL,
    RoleId INT NOT NULL FOREIGN KEY REFERENCES dbo.Roles(RoleId),
    DepartmentId INT NOT NULL FOREIGN KEY REFERENCES dbo.Departments(DepartmentId),
    PlantLocation NVARCHAR(100) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    LastLoginAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Ticket Categories Table
CREATE TABLE dbo.TicketCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryCode NVARCHAR(20) NOT NULL UNIQUE,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    SlaHours INT NOT NULL DEFAULT 24,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Priorities Table
CREATE TABLE dbo.Priorities (
    PriorityId INT IDENTITY(1,1) PRIMARY KEY,
    PriorityName NVARCHAR(20) NOT NULL UNIQUE, -- Low, Medium, High, Critical
    ColorCode NVARCHAR(10) NOT NULL DEFAULT '#6B7280',
    ResponseTimeHours INT NOT NULL DEFAULT 8
);

-- Statuses Table
CREATE TABLE dbo.Statuses (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE, -- New, Pending Approval, Approved, Rejected, In Progress, Completed, Closed, Cancelled
    Description NVARCHAR(255) NULL,
    IsFinal BIT NOT NULL DEFAULT 0
);

-- ====================================================================================
-- 3. MAIN TICKETING & WORKFLOW TABLES
-- ====================================================================================

-- Tickets Table
CREATE TABLE dbo.Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    TicketNumber NVARCHAR(30) NOT NULL UNIQUE, -- e.g., JKT-2026-08001
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    CategoryId INT NOT NULL FOREIGN KEY REFERENCES dbo.TicketCategories(CategoryId),
    PriorityId INT NOT NULL FOREIGN KEY REFERENCES dbo.Priorities(PriorityId),
    DepartmentId INT NOT NULL FOREIGN KEY REFERENCES dbo.Departments(DepartmentId),
    StatusId INT NOT NULL FOREIGN KEY REFERENCES dbo.Statuses(StatusId),
    Severity NVARCHAR(20) NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Critical
    Location NVARCHAR(100) NOT NULL,
    MachineNumber NVARCHAR(50) NULL,
    RaisedByUserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    AssignedToUserId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    CurrentApproverId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    ExpectedCompletionDate DATETIME2 NULL,
    ResolvedAt DATETIME2 NULL,
    ClosedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Approval History Table
CREATE TABLE dbo.ApprovalHistory (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tickets(TicketId) ON DELETE CASCADE,
    ApproverId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    Action NVARCHAR(50) NOT NULL, -- Approved, Rejected, Requested Info, Reassigned
    Comments NVARCHAR(MAX) NULL,
    PreviousStatusId INT NULL FOREIGN KEY REFERENCES dbo.Statuses(StatusId),
    NewStatusId INT NOT NULL FOREIGN KEY REFERENCES dbo.Statuses(StatusId),
    ActionDate DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Comments Table
CREATE TABLE dbo.Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tickets(TicketId) ON DELETE CASCADE,
    UserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    CommentText NVARCHAR(MAX) NOT NULL,
    IsInternal BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Attachments Table
CREATE TABLE dbo.Attachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tickets(TicketId) ON DELETE CASCADE,
    UploadedByUserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileType NVARCHAR(50) NOT NULL, -- Image, PDF, Excel, Video, Word
    FileSizeKb BIGINT NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Notifications Table
CREATE TABLE dbo.Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    TicketId INT NULL FOREIGN KEY REFERENCES dbo.Tickets(TicketId),
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(50) NOT NULL DEFAULT 'Info', -- Info, ApprovalRequest, TicketUpdated, TicketClosed
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Login History Table
CREATE TABLE dbo.LoginHistory (
    LoginId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(255) NULL,
    LoginStatus NVARCHAR(20) NOT NULL DEFAULT 'Success', -- Success, Failed
    LoginTime DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Audit Logs Table
CREATE TABLE dbo.AuditLogs (
    AuditId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    EntityName NVARCHAR(100) NOT NULL,
    EntityId NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(50) NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Activity Logs Table
CREATE TABLE dbo.ActivityLogs (
    ActivityId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tickets(TicketId) ON DELETE CASCADE,
    PerformedByUserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    ActivityDescription NVARCHAR(500) NOT NULL,
    ActivityType NVARCHAR(50) NOT NULL, -- StatusChange, Approval, CommentAdded, AttachmentUploaded, Reassigned
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- ====================================================================================
-- 4. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================================
CREATE NONCLUSTERED INDEX IX_Tickets_StatusId ON dbo.Tickets(StatusId);
CREATE NONCLUSTERED INDEX IX_Tickets_RaisedByUserId ON dbo.Tickets(RaisedByUserId);
CREATE NONCLUSTERED INDEX IX_Tickets_AssignedToUserId ON dbo.Tickets(AssignedToUserId);
CREATE NONCLUSTERED INDEX IX_Tickets_DepartmentId ON dbo.Tickets(DepartmentId);
CREATE NONCLUSTERED INDEX IX_Tickets_CreatedAt ON dbo.Tickets(CreatedAt DESC);
CREATE NONCLUSTERED INDEX IX_ApprovalHistory_TicketId ON dbo.ApprovalHistory(TicketId);
CREATE NONCLUSTERED INDEX IX_Notifications_UserId_IsRead ON dbo.Notifications(UserId, IsRead);
CREATE NONCLUSTERED INDEX IX_AuditLogs_Timestamp ON dbo.AuditLogs(Timestamp DESC);
GO

-- ====================================================================================
-- 5. VIEWS
-- ====================================================================================

-- View: Complete Ticket Details
CREATE OR ALTER VIEW dbo.vw_TicketDetails AS
SELECT 
    t.TicketId,
    t.TicketNumber,
    t.Title,
    t.Description,
    t.Location,
    t.MachineNumber,
    t.Severity,
    c.CategoryName,
    p.PriorityName,
    p.ColorCode AS PriorityColor,
    d.DepartmentName,
    s.StatusName,
    rb.FullName AS RaisedByName,
    rb.Username AS RaisedByUsername,
    rb.Email AS RaisedByEmail,
    at.FullName AS AssignedToName,
    ca.FullName AS CurrentApproverName,
    t.ExpectedCompletionDate,
    t.CreatedAt,
    t.UpdatedAt,
    t.ResolvedAt,
    t.ClosedAt
FROM dbo.Tickets t
INNER JOIN dbo.TicketCategories c ON t.CategoryId = c.CategoryId
INNER JOIN dbo.Priorities p ON t.PriorityId = p.PriorityId
INNER JOIN dbo.Departments d ON t.DepartmentId = d.DepartmentId
INNER JOIN dbo.Statuses s ON t.StatusId = s.StatusId
INNER JOIN dbo.Users rb ON t.RaisedByUserId = rb.UserId
LEFT JOIN dbo.Users at ON t.AssignedToUserId = at.UserId
LEFT JOIN dbo.Users ca ON t.CurrentApproverId = ca.UserId;
GO

-- View: Department Ticket Metrics
CREATE OR ALTER VIEW dbo.vw_DepartmentMetrics AS
SELECT 
    d.DepartmentId,
    d.DepartmentName,
    COUNT(t.TicketId) AS TotalTickets,
    SUM(CASE WHEN s.StatusName = 'Pending Approval' THEN 1 ELSE 0 END) AS PendingApprovals,
    SUM(CASE WHEN s.StatusName = 'In Progress' THEN 1 ELSE 0 END) AS InProgressTickets,
    SUM(CASE WHEN s.StatusName IN ('Completed', 'Closed') THEN 1 ELSE 0 END) AS ResolvedTickets,
    SUM(CASE WHEN s.StatusName = 'Rejected' THEN 1 ELSE 0 END) AS RejectedTickets
FROM dbo.Departments d
LEFT JOIN dbo.Tickets t ON d.DepartmentId = t.DepartmentId
LEFT JOIN dbo.Statuses s ON t.StatusId = s.StatusId
GROUP BY d.DepartmentId, d.DepartmentName;
GO

-- ====================================================================================
-- 6. STORED PROCEDURES
-- ====================================================================================

-- SP: Raise Ticket
CREATE OR ALTER PROCEDURE dbo.sp_RaiseTicket
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @CategoryId INT,
    @PriorityId INT,
    @DepartmentId INT,
    @RaisedByUserId INT,
    @TargetApproverId INT,
    @Location NVARCHAR(100),
    @MachineNumber NVARCHAR(50),
    @Severity NVARCHAR(20),
    @ExpectedCompletionDate DATETIME2 = NULL,
    @NewTicketId INT OUTPUT,
    @TicketNumber NVARCHAR(30) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Generate Ticket Number (JKT-YYYYMM-XXXX)
    DECLARE @Prefix NVARCHAR(20) = 'JKT-' + FORMAT(GETUTCDATE(), 'yyyyMM') + '-';
    DECLARE @NextSeq INT;
    
    SELECT @NextSeq = ISNULL(MAX(CAST(RIGHT(TicketNumber, 4) AS INT)), 0) + 1
    FROM dbo.Tickets
    WHERE TicketNumber LIKE @Prefix + '%';
    
    SET @TicketNumber = @Prefix + RIGHT('0000' + CAST(@NextSeq AS VARCHAR(4)), 4);
    
    DECLARE @PendingStatusId INT;
    SELECT TOP 1 @PendingStatusId = StatusId FROM dbo.Statuses WHERE StatusName = 'Pending Approval';
    
    INSERT INTO dbo.Tickets (
        TicketNumber, Title, Description, CategoryId, PriorityId, DepartmentId, 
        StatusId, Severity, Location, MachineNumber, RaisedByUserId, CurrentApproverId, ExpectedCompletionDate
    )
    VALUES (
        @TicketNumber, @Title, @Description, @CategoryId, @PriorityId, @DepartmentId, 
        @PendingStatusId, @Severity, @Location, @MachineNumber, @RaisedByUserId, @TargetApproverId, @ExpectedCompletionDate
    );
    
    SET @NewTicketId = SCOPE_IDENTITY();
    
    -- Add Activity Log
    INSERT INTO dbo.ActivityLogs (TicketId, PerformedByUserId, ActivityDescription, ActivityType)
    VALUES (@NewTicketId, @RaisedByUserId, 'Ticket created and sent for approval', 'StatusChange');
    
    -- Add Notification for Approver
    IF @TargetApproverId IS NOT NULL
    BEGIN
        INSERT INTO dbo.Notifications (UserId, TicketId, Title, Message, Type)
        VALUES (@TargetApproverId, @NewTicketId, 'New Approval Request', 'Ticket ' + @TicketNumber + ' requires your approval.', 'ApprovalRequest');
    END
END;
GO

-- SP: Process Approval Action
CREATE OR ALTER PROCEDURE dbo.sp_ProcessApproval
    @TicketId INT,
    @ApproverId INT,
    @Action NVARCHAR(50), -- Approved, Rejected, RequestInfo
    @Comments NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldStatusId INT;
    DECLARE @NewStatusId INT;
    DECLARE @TicketNumber NVARCHAR(30);
    DECLARE @RaisedByUserId INT;
    
    SELECT @OldStatusId = StatusId, @TicketNumber = TicketNumber, @RaisedByUserId = RaisedByUserId
    FROM dbo.Tickets WHERE TicketId = @TicketId;
    
    IF @Action = 'Approved'
        SELECT TOP 1 @NewStatusId = StatusId FROM dbo.Statuses WHERE StatusName = 'Approved';
    ELSE IF @Action = 'Rejected'
        SELECT TOP 1 @NewStatusId = StatusId FROM dbo.Statuses WHERE StatusName = 'Rejected';
    ELSE
        SELECT TOP 1 @NewStatusId = StatusId FROM dbo.Statuses WHERE StatusName = 'Pending Approval';
        
    -- Update Ticket Status
    UPDATE dbo.Tickets
    SET StatusId = @NewStatusId,
        CurrentApproverId = CASE WHEN @Action = 'Approved' THEN NULL ELSE CurrentApproverId END,
        AssignedToUserId = CASE WHEN @Action = 'Approved' THEN @ApproverId ELSE AssignedToUserId END,
        UpdatedAt = GETUTCDATE()
    WHERE TicketId = @TicketId;
    
    -- Record Approval History
    INSERT INTO dbo.ApprovalHistory (TicketId, ApproverId, Action, Comments, PreviousStatusId, NewStatusId)
    VALUES (@TicketId, @ApproverId, @Action, @Comments, @OldStatusId, @NewStatusId);
    
    -- Add Activity Log
    INSERT INTO dbo.ActivityLogs (TicketId, PerformedByUserId, ActivityDescription, ActivityType)
    VALUES (@TicketId, @ApproverId, 'Ticket marked as ' + @Action + '. Comments: ' + ISNULL(@Comments, 'None'), 'Approval');
    
    -- Notify Ticket Creator
    INSERT INTO dbo.Notifications (UserId, TicketId, Title, Message, Type)
    VALUES (@RaisedByUserId, @TicketId, 'Ticket Status Update', 'Your ticket ' + @TicketNumber + ' has been ' + @Action, 'TicketUpdated');
END;
GO

-- SP: Get Dashboard Statistics
CREATE OR ALTER PROCEDURE dbo.sp_GetDashboardStats
    @UserId INT,
    @RoleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Master Admin (RoleId = 1) sees system-wide stats
    -- Managers (RoleId = 2 or 3) see plant/assigned stats
    -- RE User (RoleId = 4) sees personal stats
    
    SELECT 
        COUNT(TicketId) AS TotalTickets,
        SUM(CASE WHEN s.StatusName = 'Pending Approval' THEN 1 ELSE 0 END) AS PendingTickets,
        SUM(CASE WHEN s.StatusName = 'Approved' THEN 1 ELSE 0 END) AS ApprovedTickets,
        SUM(CASE WHEN s.StatusName = 'Rejected' THEN 1 ELSE 0 END) AS RejectedTickets,
        SUM(CASE WHEN s.StatusName = 'Closed' THEN 1 ELSE 0 END) AS ClosedTickets,
        SUM(CASE WHEN CAST(t.CreatedAt AS DATE) = CAST(GETUTCDATE() AS DATE) THEN 1 ELSE 0 END) AS TodayTickets
    FROM dbo.Tickets t
    INNER JOIN dbo.Statuses s ON t.StatusId = s.StatusId
    WHERE 
        (@RoleId = 1) -- Master Admin sees all
        OR (@RoleId IN (2, 3) AND (t.AssignedToUserId = @UserId OR t.CurrentApproverId = @UserId OR t.DepartmentId IN (SELECT DepartmentId FROM dbo.Users WHERE UserId = @UserId)))
        OR (@RoleId = 4 AND t.RaisedByUserId = @UserId);
END;
GO

-- ====================================================================================
-- 7. TRIGGERS
-- ====================================================================================

-- Trigger: Audit Log on Ticket Change
CREATE OR ALTER TRIGGER dbo.trg_TicketAuditLog
ON dbo.Tickets
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.AuditLogs (UserId, EntityName, EntityId, Action, OldValues, NewValues)
    SELECT 
        i.RaisedByUserId,
        'Tickets',
        CAST(i.TicketId AS NVARCHAR(50)),
        'UPDATE',
        (SELECT d.TicketNumber, d.StatusId, d.AssignedToUserId FOR JSON PATH),
        (SELECT i.TicketNumber, i.StatusId, i.AssignedToUserId FOR JSON PATH)
    FROM inserted i
    INNER JOIN deleted d ON i.TicketId = d.TicketId;
END;
GO

-- ====================================================================================
-- 8. INITIAL SEED DATA
-- ====================================================================================

-- Roles
INSERT INTO dbo.Roles (RoleName, Description) VALUES
('Master Admin', 'Complete system access, user management, and system configuration'),
('JK Manager', 'Plant manager access to view, approve, reassign, and track department tickets'),
('Smart Manager', 'Operational manager access to review SLA and approve tickets'),
('RE User', 'Standard requester employee user to raise and track own tickets');

-- Departments
INSERT INTO dbo.Departments (DepartmentCode, DepartmentName) VALUES
('MFG', 'Tire Manufacturing & Production'),
('QA', 'Quality Assurance & Testing'),
('PLANT-OPS', 'Plant Machinery & Maintenance'),
('IT', 'IT Infrastructure & Automation'),
('LOGISTICS', 'Logistics & Supply Chain'),
('EHS', 'Environment, Health & Safety');

-- Priorities
INSERT INTO dbo.Priorities (PriorityName, ColorCode, ResponseTimeHours) VALUES
('Low', '#10B981', 48),
('Medium', '#F59E0B', 24),
('High', '#EF4444', 8),
('Critical', '#991B1B', 2);

-- Statuses
INSERT INTO dbo.Statuses (StatusName, Description, IsFinal) VALUES
('New', 'Ticket created but not submitted', 0),
('Pending Approval', 'Awaiting approval from Manager or Admin', 0),
('Approved', 'Ticket approved and assigned for action', 0),
('Rejected', 'Ticket rejected by approver', 1),
('In Progress', 'Work is currently being performed', 0),
('Completed', 'Ticket work completed awaiting closure verification', 0),
('Closed', 'Ticket closed successfully', 1),
('Cancelled', 'Ticket cancelled by user', 1);

-- Categories
INSERT INTO dbo.TicketCategories (CategoryCode, CategoryName, Description, SlaHours) VALUES
('MACH-BRK', 'Machine Breakdown', 'Heavy machinery or conveyor system failure in plant', 4),
('QUAL-DEF', 'Quality Defect', 'Rubber compound or tread pattern non-conformance', 12),
('IT-SYS', 'IT Hardware/Software', 'ERP system, sensor connection, or workstation fault', 8),
('MAINT-REQ', 'Scheduled Maintenance', 'Preventive equipment maintenance request', 24),
('SAFETY-HAZ', 'Safety Hazard', 'Workplace safety hazard or chemical spill alert', 2);

-- Users (Configured credentials matching enterprise matrix)
INSERT INTO dbo.Users (Username, Email, PasswordHash, FullName, Phone, RoleId, DepartmentId, PlantLocation) VALUES
('admin', 'admin@jktyre.com', 'Admin@123', 'Rajesh Sharma (Master Admin)', '+91 98765 43210', 1, 4, 'Chennai Plant 1'),
('RAGHAV', 'raghav@jktyre.com', 'jk@12345', 'Raghavan M (JK Manager)', '+91 98765 43211', 2, 1, 'Chennai Plant 1'),
('JEYAPRAKASH', 'jeyaprakash.mgr@jktyre.com', 'jk@12345', 'Jeyaprakash K (JK Manager)', '+91 98765 43212', 2, 2, 'Kankroli Plant'),
('RAHUL', 'rahul@smartcontrols.com', 'smart@123', 'Rahul S (Smart Manager)', '+91 98765 43213', 3, 3, 'Mysore Plant'),
('SACHIN', 'sachin@jktyre.com', 'smart@01', 'Sachin R (RE Engineer)', '+91 98765 43214', 4, 1, 'Chennai Plant 1'),
('THARUN', 'tharun@jktyre.com', 'smart@02', 'Tharun K (RE Engineer)', '+91 98765 43215', 4, 2, 'Chennai Plant 1'),
('JEYAPRAKASH_RE', 'jeyaprakash.re@jktyre.com', 'smart@03', 'Jeyaprakash P (RE Engineer)', '+91 98765 43216', 4, 3, 'Kankroli Plant'),
('SHANMUGHAM', 'shanmugham@jktyre.com', 'smart@04', 'Shanmugham T (RE Engineer)', '+91 98765 43217', 4, 1, 'Chennai Plant 1');

-- Initial Seed Tickets
INSERT INTO dbo.Tickets (
    TicketNumber, Title, Description, CategoryId, PriorityId, DepartmentId, StatusId, Severity, Location, MachineNumber, RaisedByUserId, AssignedToUserId, CurrentApproverId, ExpectedCompletionDate
) VALUES 
('JKT-202608-0001', 'Curing Press Hydraulic Leakage - Line 3', 'Hydraulic fluid pressure dropped unexpectedly on Curing Press #04 during shift 2.', 1, 3, 3, 2, 'High', 'Bay B - Line 3', 'CUR-PRESS-04', 4, 2, 2, DATEADD(day, 1, GETUTCDATE())),
('JKT-202608-0002', 'Tread Extruder Sensor Calibration Calibration Fault', 'Temperature thermocouple giving erratic readings (+- 15C off).', 3, 2, 4, 3, 'Medium', 'Control Room 2', 'EXT-SENS-12', 4, 3, NULL, DATEADD(day, 2, GETUTCDATE())),
('JKT-202608-0003', 'ERP Material Requisition Portal Access Issue', 'Operators unable to generate rubber compound batch sheets.', 3, 1, 4, 7, 'Low', 'IT Helpdesk', 'N/A', 4, 1, NULL, DATEADD(day, -1, GETUTCDATE()));

GO
