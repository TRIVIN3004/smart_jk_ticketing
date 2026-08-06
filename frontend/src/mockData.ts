import type { Ticket, User, NotificationItem, AuditLogItem, DepartmentItem, CategoryItem } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Rajesh Sharma',
    email: 'admin@jktyre.com',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    department: 'IT Infrastructure & Automation',
    plantLocation: 'Corporate HQ - New Delhi',
    isActive: true,
    lastLoginAt: '2026-08-06 15:10'
  },
  {
    id: 2,
    username: 'RAGHAV',
    fullName: 'Raghavan M',
    email: 'raghav@jktyre.com',
    phone: '+91 98765 43211',
    role: 'JKMANAGER',
    department: 'Tire Manufacturing & Production',
    plantLocation: 'Chennai Plant 1',
    isActive: true,
    lastLoginAt: '2026-08-06 14:45'
  },
  {
    id: 3,
    username: 'JEYAPRAKASH',
    fullName: 'Jeyaprakash K',
    email: 'jeyaprakash.mgr@jktyre.com',
    phone: '+91 98765 43212',
    role: 'JKMANAGER',
    department: 'Plant Machinery & Maintenance',
    plantLocation: 'Kankroli Plant',
    isActive: true,
    lastLoginAt: '2026-08-06 13:20'
  },
  {
    id: 4,
    username: 'RAHUL',
    fullName: 'Rahul S',
    email: 'rahul@smartcontrols.com',
    phone: '+91 98765 43213',
    role: 'SMARTADMIN',
    department: 'Quality Assurance & Testing',
    plantLocation: 'Mysore Plant',
    isActive: true,
    lastLoginAt: '2026-08-06 12:15'
  },
  {
    id: 5,
    username: 'SACHIN',
    fullName: 'Sachin R',
    email: 'sachin@jktyre.com',
    phone: '+91 98765 43214',
    role: 'USER',
    department: 'Tire Manufacturing & Production',
    plantLocation: 'Chennai Plant 1',
    isActive: true,
    lastLoginAt: '2026-08-06 15:05'
  },
  {
    id: 6,
    username: 'THARUN',
    fullName: 'Tharun K',
    email: 'tharun@jktyre.com',
    phone: '+91 98765 43215',
    role: 'USER',
    department: 'Tire Manufacturing & Production',
    plantLocation: 'Chennai Plant 1',
    isActive: true,
    lastLoginAt: '2026-08-06 11:30'
  },
  {
    id: 7,
    username: 'JEYAPRAKASH_RE',
    fullName: 'Jeyaprakash P',
    email: 'jeyaprakash.re@jktyre.com',
    phone: '+91 98765 43216',
    role: 'USER',
    department: 'Quality Assurance & Testing',
    plantLocation: 'Kankroli Plant',
    isActive: true,
    lastLoginAt: '2026-08-06 10:45'
  },
  {
    id: 8,
    username: 'SHANMUGHAM',
    fullName: 'Shanmugham T',
    email: 'shanmugham@jktyre.com',
    phone: '+91 98765 43217',
    role: 'USER',
    department: 'Tire Manufacturing & Production',
    plantLocation: 'Chennai Plant 1',
    isActive: true,
    lastLoginAt: '2026-08-06 09:20'
  }
];

export const MOCK_DEPARTMENTS: DepartmentItem[] = [
  { id: 1, name: 'Tire Manufacturing & Production', description: 'Curing, extrusion, and tire casing assembly', status: 'Active' },
  { id: 2, name: 'Plant Machinery & Maintenance', description: 'Hydraulic presses, sensors, and motor alignment', status: 'Active' },
  { id: 3, name: 'Quality Assurance & Testing', description: 'Compound rubber testing and tread depth inspection', status: 'Active' },
  { id: 4, name: 'IT Infrastructure & Automation', description: 'ERP workstations, barcode scanners, and network', status: 'Active' },
  { id: 5, name: 'Logistics & Supply Chain', description: 'Warehouse logistics and rubber batch shipping', status: 'Active' },
  { id: 6, name: 'Environment, Health & Safety', description: 'Safety hazard compliance and chemical storage', status: 'Active' }
];

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Machine Breakdown', subcategories: ['Curing Press Failure', 'Hydraulic Drip', 'Motor Overheat'], status: 'Active' },
  { id: 2, name: 'Quality Defect', subcategories: ['Thermocouple Fluctuation', 'Tread Depth Deviation', 'Compound Non-conformance'], status: 'Active' },
  { id: 3, name: 'IT Hardware/Software', subcategories: ['SAP ERP Scanner Timeout', 'Workstation Crash', 'Network Drop'], status: 'Active' },
  { id: 4, name: 'Scheduled Maintenance', subcategories: ['Conveyor Lubrication', 'Tension Alignment', 'Filter Replacement'], status: 'Active' },
  { id: 5, name: 'Safety Hazard', subcategories: ['Chemical Valve Drip', 'Emergency Stop Failure', 'Oil Spill'], status: 'Active' }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 101,
    ticketNumber: 'IM0608261',
    title: 'Curing Press Hydraulic Leakage - Line 3',
    description: 'Hydraulic fluid pressure dropped below 150 bar on Curing Press #04 during Shift 2 operations. Risk of vulcanization quality deviation.',
    ticketType: 'INCIDENT',
    category: 'Machine Breakdown',
    subcategory: 'Hydraulic Drip',
    priority: 'Critical',
    department: 'Plant Machinery & Maintenance',
    status: 'Pending Approval',
    severity: 'Critical',
    location: 'Bay B - Line 3',
    machineNumber: 'CUR-PRESS-04',
    raisedBy: 'Sachin R',
    raisedByRole: 'USER',
    currentApprover: 'Raghavan M',
    expectedCompletionDate: '2026-08-07',
    createdAt: '2026-08-06 11:30',
    attachments: [
      { id: 1, fileName: 'pressure_sensor_reading.png', fileType: 'Image', fileSizeKb: 1420, uploadedAt: '2026-08-06 11:30', url: '#' },
      { id: 2, fileName: 'hydraulic_line_schematic.pdf', fileType: 'PDF', fileSizeKb: 2890, uploadedAt: '2026-08-06 11:31', url: '#' }
    ],
    comments: [
      { id: 1, ticketId: 101, userName: 'Sachin R', userRole: 'USER', commentText: 'Urgent replacement seal required for solenoid valve B.', isInternal: false, createdAt: '2026-08-06 11:35' }
    ],
    approvalHistory: [
      { id: 1, ticketId: 101, approverName: 'System Engine', approverRole: 'ADMIN', action: 'Reassigned', comments: 'Auto-assigned based on Plant Maintenance Matrix', previousStatus: 'Open', newStatus: 'Pending Approval', actionDate: '2026-08-06 11:30' }
    ]
  },
  {
    id: 102,
    ticketNumber: 'PR0408261',
    title: 'Tread Extruder Temperature Sensor Calibration Fault',
    description: 'Zone 4 thermocouple temperature readings fluctuating +-18°C from setpoint target (165°C).',
    ticketType: 'PROBLEM',
    category: 'Quality Defect',
    subcategory: 'Thermocouple Fluctuation',
    priority: 'High',
    department: 'Quality Assurance & Testing',
    status: 'Approved',
    severity: 'High',
    location: 'Building A - Extrusion Bay',
    machineNumber: 'EXT-SENS-12',
    raisedBy: 'Tharun K',
    raisedByRole: 'USER',
    assignedTo: 'Rahul S',
    expectedCompletionDate: '2026-08-08',
    createdAt: '2026-08-06 09:15',
    updatedAt: '2026-08-06 10:45',
    attachments: [],
    comments: [
      { id: 2, ticketId: 102, userName: 'Rahul S', userRole: 'SMARTADMIN', commentText: 'Calibrator team dispatched to line.', isInternal: true, createdAt: '2026-08-06 10:50' }
    ],
    approvalHistory: [
      { id: 2, ticketId: 102, approverName: 'Rahul S', approverRole: 'SMARTADMIN', action: 'Approved', comments: 'Priority request approved for immediate calibration.', previousStatus: 'Pending Approval', newStatus: 'Approved', actionDate: '2026-08-06 10:45' }
    ]
  },
  {
    id: 103,
    ticketNumber: 'SR0408261',
    title: 'ERP Material Requisition Portal Access Timeout',
    description: 'Compound weighing station operator barcode scanners fail to submit SAP ERP batch release tokens.',
    ticketType: 'SERVICE_REQUEST',
    category: 'IT Hardware/Software',
    subcategory: 'SAP ERP Scanner Timeout',
    priority: 'Medium',
    department: 'IT Infrastructure & Automation',
    status: 'In Progress',
    severity: 'Medium',
    location: 'Control Room 2',
    machineNumber: 'WORKSTATION-IT-09',
    raisedBy: 'Raghavan M',
    raisedByRole: 'JKMANAGER',
    assignedTo: 'Rajesh Sharma',
    expectedCompletionDate: '2026-08-09',
    createdAt: '2026-08-05 16:00',
    attachments: []
  },
  {
    id: 104,
    ticketNumber: 'CR0408261',
    title: 'Preventive Maintenance - Conveyor Belt 02 Alignment',
    description: 'Quarterly scheduled tension inspection and motor roller lubrication for main tyre transfer conveyor.',
    ticketType: 'CHANGE_REQUEST',
    category: 'Scheduled Maintenance',
    subcategory: 'Conveyor Lubrication',
    priority: 'Low',
    department: 'Plant Machinery & Maintenance',
    status: 'Closed',
    severity: 'Low',
    location: 'Logistics Warehouse 4',
    machineNumber: 'CONV-BELT-02',
    raisedBy: 'Shanmugham T',
    raisedByRole: 'USER',
    assignedTo: 'Rahul S',
    expectedCompletionDate: '2026-08-05',
    createdAt: '2026-08-04 10:00',
    resolvedAt: '2026-08-05 14:00',
    closedAt: '2026-08-05 15:30',
    attachments: []
  },
  {
    id: 105,
    ticketNumber: 'IM0408262',
    title: 'Chemical Solvent Storage Valve Leak Check',
    description: 'Minor drip noticed near emergency shutoff valve #03 in chemical mixing warehouse.',
    ticketType: 'INCIDENT',
    category: 'Safety Hazard',
    subcategory: 'Chemical Valve Drip',
    priority: 'High',
    department: 'Environment, Health & Safety',
    status: 'Rejected',
    severity: 'High',
    location: 'Chemical Storage Bay 1',
    machineNumber: 'VALVE-CHEM-03',
    raisedBy: 'Jeyaprakash P',
    raisedByRole: 'USER',
    currentApprover: 'Jeyaprakash K',
    expectedCompletionDate: '2026-08-06',
    createdAt: '2026-08-06 08:00',
    approvalHistory: [
      { id: 3, ticketId: 105, approverName: 'Jeyaprakash K', approverRole: 'JKMANAGER', action: 'Rejected', comments: 'Duplicate request. EHS team already dispatched under Incident #8841.', previousStatus: 'Pending Approval', newStatus: 'Rejected', actionDate: '2026-08-06 08:40' }
    ]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'New Approval Request',
    message: 'Ticket IM0608261 (Curing Press Hydraulic Leakage) requires your approval.',
    type: 'ApprovalRequest',
    ticketId: 101,
    ticketNumber: 'IM0608261',
    isRead: false,
    createdAt: '2026-08-06 11:30'
  },
  {
    id: 2,
    title: 'Ticket Approved',
    message: 'Ticket PR0408261 has been approved by Rahul S.',
    type: 'TicketUpdated',
    ticketId: 102,
    ticketNumber: 'PR0408261',
    isRead: true,
    createdAt: '2026-08-06 10:45'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 501,
    user: 'Rajesh Sharma',
    role: 'ADMIN',
    action: 'CREATE_USER',
    entity: 'User',
    entityId: '8',
    timestamp: '2026-08-06 15:00',
    ipAddress: '10.240.12.88',
    details: 'Created new RE User: Shanmugham T (shanmugham@jktyre.com)'
  },
  {
    id: 502,
    user: 'Jeyaprakash K',
    role: 'JKMANAGER',
    action: 'REJECT_TICKET',
    entity: 'Ticket',
    entityId: 'IM0408262',
    timestamp: '2026-08-06 08:40',
    ipAddress: '10.240.14.12',
    details: 'Rejected chemical leak ticket (Duplicate)'
  }
];
