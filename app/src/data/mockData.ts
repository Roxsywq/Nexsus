import type { User, DashboardStats, ChartDataPoint, ActivityItem, ApiKey, SystemSettings, Notification } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@nexus.com',
    name: 'Alex Morgan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'admin',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'sarah@nexus.com',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'moderator',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
  {
    id: '3',
    email: 'john@nexus.com',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'user',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
  },
  {
    id: '4',
    email: 'emma@nexus.com',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    role: 'user',
    status: 'inactive',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
  {
    id: '5',
    email: 'mike@nexus.com',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'user',
    status: 'banned',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-03-12T10:30:00Z',
  },
  {
    id: '6',
    email: 'lisa@nexus.com',
    name: 'Lisa Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    role: 'moderator',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: '2024-02-20T09:30:00Z',
    updatedAt: '2024-03-08T14:00:00Z',
  },
  {
    id: '7',
    email: 'david@nexus.com',
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'user',
    status: 'pending',
    lastActive: '',
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
  },
  {
    id: '8',
    email: 'jane@nexus.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'user',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-03-10T11:30:00Z',
  },
  {
    id: '9',
    email: 'robert@nexus.com',
    name: 'Robert Taylor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    role: 'user',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-03-12T09:00:00Z',
  },
  {
    id: '10',
    email: 'amy@nexus.com',
    name: 'Amy Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amy',
    role: 'moderator',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: '2024-01-25T11:30:00Z',
    updatedAt: '2024-03-14T15:00:00Z',
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 24593,
  totalUsersChange: 12,
  revenue: 84200,
  revenueChange: 5.4,
  activeSessions: 1204,
  activeSessionsChange: 8,
  serverLoad: 42,
  serverLoadStatus: 'stable',
};

// Chart Data - User Growth
export const mockUserGrowthData: ChartDataPoint[] = [
  { name: 'Jan', value: 15000, value2: 12000 },
  { name: 'Feb', value: 18000, value2: 14000 },
  { name: 'Mar', value: 22000, value2: 17000 },
  { name: 'Apr', value: 21000, value2: 19000 },
  { name: 'May', value: 24593, value2: 21000 },
  { name: 'Jun', value: 28000, value2: 24000 },
];

// Chart Data - Traffic Sources
export const mockTrafficData: ChartDataPoint[] = [
  { name: 'Direct', value: 35 },
  { name: 'Organic', value: 28 },
  { name: 'Referral', value: 18 },
  { name: 'Social', value: 12 },
  { name: 'Email', value: 7 },
];

// Chart Data - Revenue
export const mockRevenueData: ChartDataPoint[] = [
  { name: 'Mon', value: 4200 },
  { name: 'Tue', value: 5100 },
  { name: 'Wed', value: 4800 },
  { name: 'Thu', value: 6200 },
  { name: 'Fri', value: 7500 },
  { name: 'Sat', value: 5800 },
  { name: 'Sun', value: 4900 },
];

// Activity Feed
export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'user_created',
    description: 'New user registered',
    userId: '7',
    userName: 'David Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    type: 'login',
    description: 'User logged in successfully',
    userId: '1',
    userName: 'Alex Morgan',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '3',
    type: 'user_updated',
    description: 'User role changed to Moderator',
    userId: '10',
    userName: 'Amy Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '4',
    type: 'api_call',
    description: 'API rate limit warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '5',
    type: 'user_deleted',
    description: 'User account deleted',
    userId: '5',
    userName: 'Mike Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '6',
    type: 'error',
    description: 'Database connection timeout',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '7',
    type: 'logout',
    description: 'User logged out',
    userId: '3',
    userName: 'John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

// API Keys
export const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_51Hzg2J2K8LmNpQpR7vW4xYz9AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
    prefix: 'sk_live_51Hz...',
    createdAt: '2024-01-15T10:00:00Z',
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    permissions: ['read', 'write', 'delete'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk_test_42AbCdEfGhIjKlMnOpQrStUvWxYz1234567890LmNpQpR7vW4xYz9A',
    prefix: 'sk_test_42Ab...',
    createdAt: '2024-02-01T14:30:00Z',
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    permissions: ['read', 'write'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Read-only API Key',
    key: 'sk_read_99XyZaBcDeFgHiJkLmNoPqRsTuVwXyZa1234567890BcDeFgHiJk',
    prefix: 'sk_read_99Xy...',
    createdAt: '2024-03-01T08:00:00Z',
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    permissions: ['read'],
    isActive: false,
  },
];

// System Settings
export const mockSystemSettings: SystemSettings = {
  siteName: 'Nexus Admin',
  siteDescription: 'Advanced Database Management System',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: true,
  defaultUserRole: 'user',
  sessionTimeout: 3600,
  maxLoginAttempts: 5,
  rateLimitRequests: 100,
  rateLimitWindow: 3600,
};

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to Nexus',
    message: 'Your admin dashboard is ready to use.',
    duration: 5000,
    dismissible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'success',
    title: 'Backup Complete',
    message: 'Database backup completed successfully.',
    duration: 3000,
    dismissible: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    type: 'warning',
    title: 'High Server Load',
    message: 'Server load is above 80%. Consider scaling.',
    duration: 0,
    dismissible: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

// Helper function to generate random users
export function generateMockUsers(count: number): User[] {
  const roles: User['role'][] = ['admin', 'moderator', 'user'];
  const statuses: User['status'][] = ['active', 'inactive', 'banned', 'pending'];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `${i + 11}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 11}@example.com`,
      name: `${firstName} ${lastName}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
      role,
      status,
      lastActive: status === 'pending' ? '' : new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
  });
}
