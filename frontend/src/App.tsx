import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { TicketsWorkspace } from './components/TicketsWorkspace';
import { UserManagementView } from './components/UserManagementView';
import { DepartmentsView } from './components/DepartmentsView';
import { CategoriesView } from './components/CategoriesView';
import { ReportsView } from './components/ReportsView';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AuditLogsView } from './components/AuditLogsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { RaiseTicketModal } from './components/RaiseTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';

import type { User, Ticket, UserRole, NotificationItem, AuditLogItem, DepartmentItem, CategoryItem } from './types';
import { MOCK_USERS, MOCK_TICKETS, MOCK_NOTIFICATIONS, MOCK_AUDIT_LOGS, MOCK_DEPARTMENTS, MOCK_CATEGORIES } from './mockData';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // ADMIN by default
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Application Data States
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [departments, setDepartments] = useState<DepartmentItem[]>(MOCK_DEPARTMENTS);
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);

  // Modals state
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Apply dark mode class to HTML root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (username: string, role: UserRole) => {
    const matchedUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.role === role) || {
      id: Date.now(),
      username,
      fullName: `${role} Personnel`,
      email: `${username}@jktyre.com`,
      role,
      department: 'Tire Manufacturing & Production',
      plantLocation: 'Chennai Plant 1',
      isActive: true
    };
    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: Date.now(),
      createdAt: '2026-08-06 15:40',
      approvalHistory: [
        {
          id: Date.now(),
          ticketId: Date.now(),
          approverName: 'System Engine',
          approverRole: 'ADMIN',
          action: 'Reassigned',
          comments: 'Auto routed to Department Approver matrix',
          previousStatus: 'Open',
          newStatus: 'Pending Approval',
          actionDate: '2026-08-06 15:40'
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add Audit Log
    setAuditLogs(prev => [
      {
        id: Date.now(),
        user: currentUser.fullName,
        role: currentUser.role,
        action: 'RAISE_TICKET',
        entity: 'Ticket',
        entityId: newTicket.ticketNumber,
        timestamp: '2026-08-06 15:40',
        ipAddress: '10.240.15.22',
        details: `Raised new ticket ${newTicket.ticketNumber}: ${newTicket.title}`
      },
      ...prev
    ]);

    // Add Notification
    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'New Ticket Raised',
        message: `Ticket ${newTicket.ticketNumber} submitted by ${currentUser.fullName}`,
        type: 'ApprovalRequest',
        ticketId: newTicket.id,
        ticketNumber: newTicket.ticketNumber,
        isRead: false,
        createdAt: '2026-08-06 15:40'
      },
      ...prev
    ]);
  };

  const handleApproveTicket = (ticketId: number, comment: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedHistory = t.approvalHistory || [];
        return {
          ...t,
          status: 'Approved',
          updatedAt: '2026-08-06 15:40',
          approvalHistory: [
            ...updatedHistory,
            {
              id: Date.now(),
              ticketId,
              approverName: currentUser.fullName,
              approverRole: currentUser.role,
              action: 'Approved',
              comments: comment,
              previousStatus: t.status,
              newStatus: 'Approved',
              actionDate: '2026-08-06 15:40'
            }
          ]
        };
      }
      return t;
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handleRejectTicket = (ticketId: number, comment: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedHistory = t.approvalHistory || [];
        return {
          ...t,
          status: 'Rejected',
          updatedAt: '2026-08-06 15:40',
          approvalHistory: [
            ...updatedHistory,
            {
              id: Date.now(),
              ticketId,
              approverName: currentUser.fullName,
              approverRole: currentUser.role,
              action: 'Rejected',
              comments: comment,
              previousStatus: t.status,
              newStatus: 'Rejected',
              actionDate: '2026-08-06 15:40'
            }
          ]
        };
      }
      return t;
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  const handleRequestInfo = (ticketId: number, comment: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedHistory = t.approvalHistory || [];
        return {
          ...t,
          approvalHistory: [
            ...updatedHistory,
            {
              id: Date.now(),
              ticketId,
              approverName: currentUser.fullName,
              approverRole: currentUser.role,
              action: 'Request Info',
              comments: comment,
              previousStatus: t.status,
              newStatus: t.status,
              actionDate: '2026-08-06 15:40'
            }
          ]
        };
      }
      return t;
    }));
  };

  const handleAddComment = (ticketId: number, commentText: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const comments = t.comments || [];
        return {
          ...t,
          comments: [
            ...comments,
            {
              id: Date.now(),
              ticketId,
              userName: currentUser.fullName,
              userRole: currentUser.role,
              commentText,
              isInternal: false,
              createdAt: '2026-08-06 15:40'
            }
          ]
        };
      }
      return t;
    }));
  };

  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = { ...newUserData, id: Date.now() };
    setUsers(prev => [...prev, newUser]);
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const handleResetPassword = () => {
    alert("Temporary reset token sent to user email. Password reset to default password.");
  };

  const handleAddDepartment = (dept: Omit<DepartmentItem, 'id'>) => {
    setDepartments(prev => [...prev, { ...dept, id: Date.now() }]);
  };

  const handleAddCategory = (cat: Omit<CategoryItem, 'id'>) => {
    setCategories(prev => [...prev, { ...cat, id: Date.now() }]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020408] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Responsive Left Sidebar Drawer */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'create-ticket') {
            setIsRaiseModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onLogout={handleLogout}
        unreadNotifCount={unreadCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Responsive Top Header */}
      <Header
        activeTab={activeTab}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        unreadNotifCount={unreadCount}
        onNavigate={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentUser={currentUser}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Container Area - Using pt-28 (112px clearance) and px-4 md:px-8 so padding is NEVER overridden */}
      <main className="md:ml-64 pt-28 pb-16 px-4 md:px-8 min-h-screen">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            tickets={tickets}
            onOpenRaiseTicket={() => setIsRaiseModalOpen(true)}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onNavigateTab={setActiveTab}
          />
        )}

        {(activeTab === 'tickets' || activeTab === 'approvals') && (
          <TicketsWorkspace
            tickets={activeTab === 'approvals' ? tickets.filter(t => t.status === 'Pending Approval') : tickets}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onOpenRaiseTicket={() => setIsRaiseModalOpen(true)}
            currentUserRole={currentUser.role}
            searchQuery={globalSearchQuery}
          />
        )}

        {activeTab === 'users' && (
          <UserManagementView
            users={users}
            onAddUser={handleAddUser}
            onToggleUserStatus={handleToggleUserStatus}
            onResetPassword={handleResetPassword}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentsView
            departments={departments}
            onAddDepartment={handleAddDepartment}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            onAddCategory={handleAddCategory}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView tickets={tickets} />
        )}

        {activeTab === 'audit' && (
          <AuditLogsView logs={auditLogs} />
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex justify-between items-center p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-outfit uppercase">System Notifications</h2>
              <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))} className="px-4 py-2 rounded-xl bg-[#ffd600] text-black text-xs font-extrabold cursor-pointer">
                ✓ Mark All Read
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 rounded-2xl border ${!n.isRead ? 'bg-[#ffd600]/10 border-[#ffd600]/30' : 'bg-white dark:bg-[#12151e] border-slate-200 dark:border-white/10'}`}>
                  <div className="flex justify-between font-bold text-xs">
                    <span>{n.title}</span>
                    <span className="text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileView currentUser={currentUser} />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}

      </main>

      {/* Modals & Slide-overs */}
      <RaiseTicketModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        onSubmitTicket={handleCreateTicket}
        currentUserRole={currentUser.role}
        currentUserName={currentUser.fullName}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onApproveTicket={handleApproveTicket}
        onRejectTicket={handleRejectTicket}
        onRequestInfo={handleRequestInfo}
        onAddComment={handleAddComment}
        currentUserRole={currentUser.role}
        currentUserName={currentUser.fullName}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
        onSelectNotificationTicket={(tId) => {
          const found = tickets.find(t => t.id === tId);
          if (found) setSelectedTicket(found);
        }}
      />

    </div>
  );
}

export default App;
