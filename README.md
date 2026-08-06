# SMART CONTROLS — Enterprise Ticket Management System
> **A Member of Zeppelin Group** | Enterprise Ticket Raising, Approval Workflow, Real-Time Analytics & Audit Trail System

[![ASP.NET Core 8](https://img.shields.io/badge/Backend-ASP.NET%20Core%208.0-blue.svg)](https://dotnet.microsoft.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8.svg)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/Database-Microsoft%20SQL%20Server-cc292b.svg)](https://www.microsoft.com/sql-server/)
[![Chart.js](https://img.shields.io/badge/Analytics-Chart.js-ff6384.svg)](https://www.chartjs.org/)

---

## 📌 Executive Overview

**SMART CONTROLS Ticket Management System** is a ServiceNow-inspired, enterprise-grade industrial issue tracking and multi-tier approval platform designed for plant machinery breakdown management, quality non-conformance tracking, IT service requests, and SLA compliance monitoring.

### Key Capabilities
- 📊 **Dynamic 2x2 Chart.js Dashboard**: Real-time visual metrics for Tickets by Status (Doughnut), Priority SLA Breakdown (Doughnut), Monthly Volume Trend (Line Gradient), and Department Distribution (Bar Chart).
- 🏷️ **Automated Ticket ID Prefix Rules**: Ticket numbers auto-formatted by category:
  - **INCIDENT** -> `IM` (e.g. `IM0608261`)
  - **PROBLEM** -> `PR` (e.g. `PR0408261`)
  - **SERVICE_REQUEST** -> `SR` (e.g. `SR0408261`)
  - **CHANGE_REQUEST** -> `CR` (e.g. `CR0408261`)
  - **DEPLOYMENT** -> `DP` (e.g. `DP0408261`)
  - **RELEASE** -> `RL` (e.g. `RL0408261`)
- 🌓 **Adaptive Light & Dark Mode**: Seamless theme switcher with tailored color palettes for sidebars, headers, cards, tables, and Chart.js canvases.
- 📱 **Fully Responsive Mobile Drawer**: Mobile hamburger drawer with touch momentum scrolling on smartphones and tablets.
- 🛡️ **Role-Based Access Control (RBAC)**: Distinct permissions for Master Admin, JK Manager, Smart Manager, and RE Engineer users.
- 📜 **Security Audit Trail**: Immutable logging of administrative actions, user creation, status changes, and IP addresses.

---

## 🔐 Configured User Accounts & Credentials

The system comes pre-configured with the following user accounts and passwords:

| Role Group | Username | Password | Full Name | Department / Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **JKMANAGER** | `RAGHAV` | `jk@12345` | Raghavan M | Tire Manufacturing (JK Manager) |
| **JKMANAGER** | `JEYAPRAKASH` | `jk@12345` | Jeyaprakash K | Plant Machinery (JK Manager) |
| **SMARTMANAGER** | `RAHUL` | `smart@123` | Rahul S | Quality QA (Smart Manager / Admin) |
| **RE User** | `SACHIN` | `smart@01` | Sachin R | Tire Manufacturing (RE Engineer) |
| **RE User** | `THARUN` | `smart@02` | Tharun K | Tire Manufacturing (RE Engineer) |
| **RE User** | `JEYAPRAKASH_RE` | `smart@03` | Jeyaprakash P | Quality QA (RE Engineer) |
| **RE User** | `SHANMUGHAM` | `smart@04` | Shanmugham T | Tire Manufacturing (RE Engineer) |
| **Master Admin** | `admin` | `Admin@123` | Rajesh Sharma | System Control (Master Admin) |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 & Custom Design Tokens (`index.css`)
- **Charts & Visualization**: Chart.js v4 & `react-chartjs-2`
- **Icons**: Lucide React Icons
- **Build Tool**: Vite v8

### Backend (.NET 8 Web API)
- **Framework**: ASP.NET Core 8 Web API
- **ORM**: Entity Framework Core 8 (`Microsoft.EntityFrameworkCore.SqlServer`)
- **Authentication**: JWT Bearer Token Authentication & Role Claims
- **Documentation**: Swagger / OpenAPI v1

### Database
- **Engine**: Microsoft SQL Server (SSMS / SQL Server Express / Standard)
- **Schema File**: [`database/schema.sql`](file:///c:/Users/VICTUS/OneDrive/Desktop/ticketing%20System/database/schema.sql) (14 Tables, Views, Stored Procedures, Triggers)

---

## 🗄️ Database Setup (SSMS)

1. Open **Microsoft SQL Server Management Studio (SSMS)**.
2. Connect to your local or remote SQL Server instance (`localhost` or `.\SQLEXPRESS`).
3. Open and execute the T-SQL DDL script:
   ```sql
   database/schema.sql
   ```
4. This will automatically create the database `JKTyre_TicketingDB`, all 14 tables, audit triggers, stored procedures, and initial seed data.

---

## ⚙️ Environment Configuration (`.env`)

Configuration files are located in key directories:

### Root Environment [`/.env`](file:///c:/Users/VICTUS/OneDrive/Desktop/ticketing%20System/.env)
```env
# Microsoft SQL Server (SSMS) Connection Settings
DB_SERVER=localhost
DB_NAME=JKTyre_TicketingDB
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_PORT=1433

# ASP.NET Core Entity Framework Connection String
ConnectionStrings__DefaultConnection="Server=localhost;Database=JKTyre_TicketingDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

# JWT Authentication Config
JWT_SECRET="JKTyre_Enterprise_Super_Secret_Key_2026_Smart_Ticket_System_Secure!"
JWT_ISSUER="JKTyre.Ticketing.Api"
JWT_AUDIENCE="JKTyre.Ticketing.Client"
JWT_EXPIRY_MINUTES=480

# Frontend API URL
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

---

## 🚀 Running the Application Locally

### 1. Run Backend (.NET 8 Web API)
```bash
cd backend
dotnet restore
dotnet run
```
- API Swagger UI available at: `http://localhost:5000/swagger`

### 2. Run Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application available at: `http://localhost:3000`

### 3. Production Build Validation
```bash
cd frontend
npm run build
```

---

## 📁 Repository Directory Structure

```
ticketing System/
├── README.md                     # Official Technical Documentation
├── .env                          # Master Environment & SSMS Config
│
├── database/
│   └── schema.sql                # Complete T-SQL DDL & DML Database Script
│
├── backend/                      # ASP.NET Core 8 Web API
│   ├── .env                      # Backend Environment Config
│   ├── appsettings.json          # Server Settings & Connection String
│   ├── Program.cs                # Dependency Injection & Middleware
│   ├── Data/                     # EF Core DbContext & Models
│   ├── DTOs/                     # Data Transfer Objects
│   └── Controllers/              # API REST Endpoints (Auth, Tickets, Users)
│
└── frontend/                     # React 18 TypeScript Frontend
    ├── .env                      # Vite Environment Config
    ├── public/
    │   └── logo.png              # SMART CONTROLS Metallic Dolphin Logo
    ├── src/
    │   ├── main.tsx              # Application Entrypoint
    │   ├── App.tsx               # Main Layout, Navigation & Modals
    │   ├── index.css             # Design Tokens & Theme Variables
    │   ├── types.ts              # TypeScript Interfaces & Prefix Helper
    │   ├── mockData.ts           # Demo Users, Tickets & Audit Logs
    │   └── components/           # UI Views & Components
    │       ├── Header.tsx        # Top App Header with Mobile Toggle
    │       ├── Sidebar.tsx       # Responsive Navigation Drawer
    │       ├── LoginScreen.tsx   # Sign-In Form with Smart Controls Logo
    │       ├── DashboardView.tsx # 2x2 Chart.js Operations Grid
    │       ├── TicketsWorkspace.tsx # Data Table with Outlined Type Badges
    │       ├── RaiseTicketModal.tsx # New Ticket Creation Modal
    │       ├── TicketDetailModal.tsx# Approval & Discussion Drawer
    │       ├── UserManagementView.tsx # RBAC User Control Panel
    │       ├── ReportsView.tsx   # Analytics Reports
    │       └── AuditLogsView.tsx # System Security Logs
```

---

## 🌐 IIS & Windows Server Deployment Guide

To deploy the ASP.NET Core API and React frontend on Windows Server inside IIS:

1. **Install IIS Prerequisites**:
   - Install **ASP.NET Core Hosting Bundle 8.0** on Windows Server.
2. **Publish Backend**:
   ```bash
   cd backend
   dotnet publish -c Release -o C:\inetpub\wwwroot\smart-controls-api
   ```
3. **Publish Frontend**:
   ```bash
   cd frontend
   npm run build
   ```
   - Copy `frontend/dist/*` to `C:\inetpub\wwwroot\smart-controls-ui`.
4. **Create IIS Sites**:
   - Add Website in IIS Manager pointing to `C:\inetpub\wwwroot\smart-controls-ui` on Port 80 / 443.
   - Add Application / API pointing to `C:\inetpub\wwwroot\smart-controls-api` with `No Managed Code` AppPool.

---

## 📄 License & Attribution
- **Company**: SMART CONTROLS (A Member of Zeppelin Group)
- **Portal**: Enterprise Ticket Raising & Approval System
