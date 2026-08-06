export type UserRole = 'ADMIN' | 'JKMANAGER' | 'SMARTADMIN' | 'USER' | 'Master Admin' | 'JK Manager' | 'Smart Manager' | 'RE User';

export type TicketType = 
  | 'INCIDENT' 
  | 'PROBLEM' 
  | 'SERVICE_REQUEST' 
  | 'CHANGE_REQUEST' 
  | 'DEPLOYMENT' 
  | 'RELEASE';

export const getTicketPrefix = (type: TicketType): string => {
  switch (type) {
    case 'INCIDENT': return 'IM';
    case 'RELEASE': return 'RL';
    case 'DEPLOYMENT': return 'DP';
    case 'CHANGE_REQUEST': return 'CR';
    case 'PROBLEM': return 'PR';
    case 'SERVICE_REQUEST': return 'SR';
    default: return 'IM';
  }
};

export type TicketStatus = 
  | 'Open'
  | 'Pending Approval' 
  | 'Approved' 
  | 'In Progress' 
  | 'Resolved'
  | 'Closed' 
  | 'Rejected'
  | 'Cancelled';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  department: string;
  plantLocation: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface DepartmentItem {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface CategoryItem {
  id: number;
  name: string;
  subcategories: string[];
  status: 'Active' | 'Inactive';
}

export interface TicketAttachment {
  id: number;
  fileName: string;
  fileType: 'Image' | 'PDF' | 'Excel' | 'Video' | 'Document';
  fileSizeKb: number;
  uploadedAt: string;
  url: string;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  userName: string;
  userRole: UserRole;
  commentText: string;
  isInternal: boolean;
  createdAt: string;
}

export interface ApprovalHistoryItem {
  id: number;
  ticketId: number;
  approverName: string;
  approverRole: UserRole;
  action: 'Approved' | 'Rejected' | 'Request Info' | 'Reassigned';
  comments: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  actionDate: string;
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  ticketType: TicketType;
  category: string;
  subcategory?: string;
  priority: TicketPriority;
  department: string;
  status: TicketStatus;
  severity: TicketPriority;
  location: string;
  machineNumber?: string;
  raisedBy: string;
  raisedByRole: UserRole;
  assignedTo?: string;
  currentApprover?: string;
  expectedCompletionDate: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  attachments?: TicketAttachment[];
  comments?: TicketComment[];
  approvalHistory?: ApprovalHistoryItem[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'Info' | 'ApprovalRequest' | 'TicketUpdated' | 'TicketClosed';
  ticketId?: number;
  ticketNumber?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: number;
  user: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface SystemConfig {
  serverName: string;
  databaseName: string;
  username: string;
  port: number;
  apiBaseUrl: string;
  jwtSecret: string;
  sessionTimeoutMinutes: number;
}
