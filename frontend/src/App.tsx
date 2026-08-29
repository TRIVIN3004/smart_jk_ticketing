import { useState, useEffect, useCallback } from 'react';
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
  
  // Auth state - Persisted in localStorage to prevent logging out on page refresh
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('smart_jk_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('smart_jk_authenticated');
      return savedAuth === 'true' && localStorage.getItem('smart_jk_user') !== null;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Application Data States - Persisted in localStorage so refreshing reloads latest data without reset
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_users');
      return saved ? JSON.parse(saved) : MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_tickets');
      return saved ? JSON.parse(saved) : MOCK_TICKETS;
    } catch {
      return MOCK_TICKETS;
    }
  });

  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_departments');
      return saved ? JSON.parse(saved) : MOCK_DEPARTMENTS;
    } catch {
      return MOCK_DEPARTMENTS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_categories');
      return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_notifications');
      return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart_jk_audit_logs');
      return saved ? JSON.parse(saved) : MOCK_AUDIT_LOGS;
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  });

  // Modals state
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Sync state from LocalStorage for multi-tab / real-time updates
  const syncDataFromStorage = useCallback(() => {
    try {
      const savedTickets = localStorage.getItem('smart_jk_tickets');
      if (savedTickets) setTickets(JSON.parse(savedTickets));

      const savedNotifs = localStorage.getItem('smart_jk_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedLogs = localStorage.getItem('smart_jk_audit_logs');
      if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

      const savedUsers = localStorage.getItem('smart_jk_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedDepts = localStorage.getItem('smart_jk_departments');
      if (savedDepts) setDepartments(JSON.parse(savedDepts));

      const savedCats = localStorage.getItem('smart_jk_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));
    } catch (err) {
      console.error('Data sync error:', err);
    }
  }, []);

  // Broadcast data updates to other open tabs
  const broadcastUpdate = () => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('smart_jk_sync_channel');
        channel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {
      console.error('Broadcast error:', e);
    }
  };

  // Cross-tab broadcast & storage event listeners
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('smart_jk_sync_channel');
        channel.onmessage = () => {
          syncDataFromStorage();
        };
      }
    } catch (e) {
      console.error('BroadcastChannel initialization error:', e);
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('smart_jk_')) {
        syncDataFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [syncDataFromStorage]);

  // Apply dark mode class to HTML root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync session state to localStorage
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      localStorage.setItem('smart_jk_user', JSON.stringify(currentUser));
      localStorage.setItem('smart_jk_authenticated', 'true');
    } else {
      localStorage.removeItem('smart_jk_user');
      localStorage.removeItem('smart_jk_authenticated');
    }
  }, [currentUser, isAuthenticated]);

  // Sync data states to localStorage & broadcast
  useEffect(() => {
    localStorage.setItem('smart_jk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('smart_jk_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('smart_jk_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('smart_jk_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('smart_jk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smart_jk_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

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
    syncDataFromStorage();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('smart_jk_user');
    localStorage.removeItem('smart_jk_authenticated');
  };

  const handleCreateTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTicket: Ticket = {
      ...newTicketData,
      id: Date.now(),
      createdAt: formattedDate,
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
          actionDate: formattedDate
        }
      ]
    };

    setTickets(prev => {
      const updated = [newTicket, ...prev];
      localStorage.setItem('smart_jk_tickets', JSON.stringify(updated));
      return updated;
    });

    // Add Audit Log
    setAuditLogs(prev => {
      const updated = [
        {
          id: Date.now(),
          user: currentUser.fullName,
          role: currentUser.role,
          action: 'RAISE_TICKET',
          entity: 'Ticket',
          entityId: newTicket.ticketNumber,
          timestamp: formattedDate,
          ipAddress: '10.240.15.22',
          details: `Raised new ticket ${newTicket.ticketNumber}: ${newTicket.title}`
        },
        ...prev
      ];
      localStorage.setItem('smart_jk_audit_logs', JSON.stringify(updated));
      return updated;
    });

    // Add Notification
    setNotifications(prev => {
      const updated = [
        {
          id: Date.now(),
          title: 'New Ticket Raised',
          message: `Ticket ${newTicket.ticketNumber} submitted by ${currentUser.fullName}`,
          type: 'ApprovalRequest' as const,
          ticketId: newTicket.id,
          ticketNumber: newTicket.ticketNumber,
          isRead: false,
          createdAt: formattedDate
        },
        ...prev
      ];
      localStorage.setItem('smart_jk_notifications', JSON.stringify(updated));
      return updated;
    });

    // Broadcast change so other open user sessions / tabs get updated immediately
    broadcastUpdate();
  };

  const handleApproveTicket = (ticketId: number, comment: string) => {
    if (!currentUser) return;
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTickets(prev => {
      const updated = prev.map(t => {
        if (t.id === ticketId) {
          const updatedHistory = t.approvalHistory || [];
          return {
            ...t,
            status: 'Approved' as const,
            updatedAt: formattedDate,
            approvalHistory: [
              ...updatedHistory,
              {
                id: Date.now(),
                ticketId,
                approverName: currentUser.fullName,
                approverRole: currentUser.role,
                action: 'Approved' as const,
                comments: comment,
                previousStatus: t.status,
                newStatus: 'Approved' as const,
                actionDate: formattedDate
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('smart_jk_tickets', JSON.stringify(updated));
      return updated;
    });

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
    broadcastUpdate();
  };

  const handleRejectTicket = (ticketId: number, comment: string) => {
    if (!currentUser) return;
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTickets(prev => {
      const updated = prev.map(t => {
        if (t.id === ticketId) {
          const updatedHistory = t.approvalHistory || [];
          return {
            ...t,
            status: 'Rejected' as const,
            updatedAt: formattedDate,
            approvalHistory: [
              ...updatedHistory,
              {
                id: Date.now(),
                ticketId,
                approverName: currentUser.fullName,
                approverRole: currentUser.role,
                action: 'Rejected' as const,
                comments: comment,
                previousStatus: t.status,
                newStatus: 'Rejected' as const,
                actionDate: formattedDate
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('smart_jk_tickets', JSON.stringify(updated));
      return updated;
    });

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
    broadcastUpdate();
  };

  const handleRequestInfo = (ticketId: number, comment: string) => {
    if (!currentUser) return;
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTickets(prev => {
      const updated = prev.map(t => {
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
                action: 'Request Info' as const,
                comments: comment,
                previousStatus: t.status,
                newStatus: t.status,
                actionDate: formattedDate
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('smart_jk_tickets', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const handleAddComment = (ticketId: number, commentText: string) => {
    if (!currentUser) return;
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTickets(prev => {
      const updated = prev.map(t => {
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
                createdAt: formattedDate
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('smart_jk_tickets', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = { ...newUserData, id: Date.now() };
    setUsers(prev => {
      const updated = [...prev, newUser];
      localStorage.setItem('smart_jk_users', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u);
      localStorage.setItem('smart_jk_users', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const handleResetPassword = () => {
    alert("Temporary reset token sent to user email. Password reset to default password.");
  };

  const handleAddDepartment = (dept: Omit<DepartmentItem, 'id'>) => {
    setDepartments(prev => {
      const updated = [...prev, { ...dept, id: Date.now() }];
      localStorage.setItem('smart_jk_departments', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const handleAddCategory = (cat: Omit<CategoryItem, 'id'>) => {
    setCategories(prev => {
      const updated = [...prev, { ...cat, id: Date.now() }];
      localStorage.setItem('smart_jk_categories', JSON.stringify(updated));
      return updated;
    });
    broadcastUpdate();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isAuthenticated || !currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  const user = currentUser;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020408] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Responsive Left Sidebar Drawer */}
      <Sidebar
        currentUser={user}
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
        currentUser={user}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onRefreshData={syncDataFromStorage}
      />

      {/* Main Container Area */}
      <main className="md:ml-64 pt-28 pb-16 px-4 md:px-8 min-h-screen">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={user}
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
            currentUserRole={user.role}
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
                    <span className="text-[#ffd600] font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileView currentUser={user} />
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
        currentUserRole={user.role}
        currentUserName={user.fullName}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onApproveTicket={handleApproveTicket}
        onRejectTicket={handleRejectTicket}
        onRequestInfo={handleRequestInfo}
        onAddComment={handleAddComment}
        currentUserRole={user.role}
        currentUserName={user.fullName}
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
