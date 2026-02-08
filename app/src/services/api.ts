import type { 
  User, 
  UserFormData, 
  LoginCredentials, 
  AuthResponse, 
  DashboardStats, 
  ChartDataPoint, 
  ActivityItem,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  SystemSettings,
  ApiKey,
  Notification
} from '@/types';
import { 
  mockUsers, 
  mockDashboardStats, 
  mockUserGrowthData, 
  mockTrafficData, 
  mockRevenueData,
  mockActivities,
  mockSystemSettings,
  mockApiKeys,
  mockNotifications,
  generateMockUsers
} from '@/data/mockData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (for testing)
const simulateError = (probability: number = 0.05): boolean => {
  return Math.random() < probability;
};

// Auth Service
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(800);
    
    if (simulateError(0.1)) {
      return {
        success: false,
        data: null as unknown as AuthResponse,
        error: { code: 'AUTH_ERROR', message: 'Invalid credentials' },
      };
    }

    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password') {
      return {
        success: false,
        data: null as unknown as AuthResponse,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' },
      };
    }

    const authResponse: AuthResponse = {
      user,
      token: `mock_jwt_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
      expiresAt: Date.now() + 3600 * 1000,
    };

    // Store in localStorage for persistence
    localStorage.setItem('nexus_auth', JSON.stringify(authResponse));

    return {
      success: true,
      data: authResponse,
      message: 'Login successful',
    };
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(300);
    localStorage.removeItem('nexus_auth');
    
    return {
      success: true,
      data: undefined,
      message: 'Logout successful',
    };
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    await delay(500);
    
    const stored = localStorage.getItem('nexus_auth');
    if (!stored) {
      return {
        success: false,
        data: null as unknown as AuthResponse,
        error: { code: 'TOKEN_INVALID', message: 'Invalid refresh token' },
      };
    }

    const auth = JSON.parse(stored);
    auth.token = `mock_jwt_token_${Date.now()}`;
    auth.expiresAt = Date.now() + 3600 * 1000;
    
    localStorage.setItem('nexus_auth', JSON.stringify(auth));

    return {
      success: true,
      data: auth,
      message: 'Token refreshed',
    };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(400);
    
    const stored = localStorage.getItem('nexus_auth');
    if (!stored) {
      return {
        success: false,
        data: null as unknown as User,
        error: { code: 'NOT_AUTHENTICATED', message: 'Not authenticated' },
      };
    }

    const auth = JSON.parse(stored);
    
    if (auth.expiresAt < Date.now()) {
      localStorage.removeItem('nexus_auth');
      return {
        success: false,
        data: null as unknown as User,
        error: { code: 'TOKEN_EXPIRED', message: 'Session expired' },
      };
    }

    return {
      success: true,
      data: auth.user,
    };
  },
};

// User Service
export const userService = {
  async getUsers(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    await delay(600);
    
    let filteredUsers = [...mockUsers, ...generateMockUsers(40)];
    
    // Search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Filters
    if (params?.filters) {
      if (params.filters.role) {
        const roles = Array.isArray(params.filters.role) 
          ? params.filters.role 
          : [params.filters.role];
        filteredUsers = filteredUsers.filter(u => roles.includes(u.role));
      }
      if (params.filters.status) {
        const statuses = Array.isArray(params.filters.status)
          ? params.filters.status
          : [params.filters.status];
        filteredUsers = filteredUsers.filter(u => statuses.includes(u.status));
      }
    }
    
    // Sort
    if (params?.sortBy) {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
      filteredUsers.sort((a, b) => {
        const aVal = a[params.sortBy as keyof User];
        const bVal = b[params.sortBy as keyof User];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder * aVal.localeCompare(bVal);
        }
        return sortOrder * ((aVal as number) - (bVal as number));
      });
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filteredUsers.slice(start, end);
    
    return {
      success: true,
      data: {
        items,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await delay(400);
    
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        data: null as unknown as User,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      };
    }
    
    return {
      success: true,
      data: user,
    };
  },

  async createUser(data: UserFormData): Promise<ApiResponse<User>> {
    await delay(700);
    
    if (mockUsers.some(u => u.email === data.email)) {
      return {
        success: false,
        data: null as unknown as User,
        error: { code: 'DUPLICATE_EMAIL', message: 'Email already exists' },
      };
    }
    
    const newUser: User = {
      id: `${Date.now()}`,
      ...data,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      lastActive: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };
  },

  async updateUser(id: string, data: Partial<UserFormData>): Promise<ApiResponse<User>> {
    await delay(600);
    
    const index = mockUsers.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        data: null as unknown as User,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      };
    }
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: mockUsers[index],
      message: 'User updated successfully',
    };
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    
    const index = mockUsers.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        data: undefined,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      };
    }
    
    mockUsers.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'User deleted successfully',
    };
  },

  async bulkDeleteUsers(ids: string[]): Promise<ApiResponse<void>> {
    await delay(800);
    
    ids.forEach(id => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
    });
    
    return {
      success: true,
      data: undefined,
      message: `${ids.length} users deleted successfully`,
    };
  },
};

// Dashboard Service
export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(500);
    
    // Simulate real-time updates
    const stats = {
      ...mockDashboardStats,
      activeSessions: Math.floor(1100 + Math.random() * 300),
      serverLoad: Math.floor(35 + Math.random() * 30),
    };
    
    return {
      success: true,
      data: stats,
    };
  },

  async getUserGrowth(): Promise<ApiResponse<ChartDataPoint[]>> {
    await delay(600);
    
    return {
      success: true,
      data: mockUserGrowthData,
    };
  },

  async getTrafficSources(): Promise<ApiResponse<ChartDataPoint[]>> {
    await delay(500);
    
    return {
      success: true,
      data: mockTrafficData,
    };
  },

  async getRevenue(): Promise<ApiResponse<ChartDataPoint[]>> {
    await delay(500);
    
    return {
      success: true,
      data: mockRevenueData,
    };
  },

  async getActivities(limit: number = 10): Promise<ApiResponse<ActivityItem[]>> {
    await delay(400);
    
    return {
      success: true,
      data: mockActivities.slice(0, limit),
    };
  },
};

// Settings Service
export const settingsService = {
  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    await delay(400);
    
    return {
      success: true,
      data: mockSystemSettings,
    };
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
    await delay(600);
    
    Object.assign(mockSystemSettings, settings);
    
    return {
      success: true,
      data: mockSystemSettings,
      message: 'Settings updated successfully',
    };
  },

  async getApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    await delay(500);
    
    return {
      success: true,
      data: mockApiKeys,
    };
  },

  async createApiKey(name: string, permissions: string[]): Promise<ApiResponse<ApiKey>> {
    await delay(700);
    
    const newKey: ApiKey = {
      id: `${Date.now()}`,
      name,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      prefix: `sk_live_${Math.random().toString(36).substring(2, 6)}...`,
      createdAt: new Date().toISOString(),
      permissions,
      isActive: true,
    };
    
    mockApiKeys.push(newKey);
    
    return {
      success: true,
      data: newKey,
      message: 'API key created successfully',
    };
  },

  async revokeApiKey(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    
    const index = mockApiKeys.findIndex(k => k.id === id);
    
    if (index === -1) {
      return {
        success: false,
        data: undefined,
        error: { code: 'NOT_FOUND', message: 'API key not found' },
      };
    }
    
    mockApiKeys[index].isActive = false;
    
    return {
      success: true,
      data: undefined,
      message: 'API key revoked successfully',
    };
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    await delay(300);
    
    return {
      success: true,
      data: mockNotifications,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    await delay(200);
    
    return {
      success: true,
      data: undefined,
    };
  },

  async dismissNotification(id: string): Promise<ApiResponse<void>> {
    await delay(200);
    
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    
    return {
      success: true,
      data: undefined,
    };
  },
};

// Rate Limiting Simulation
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number = 100;
  private window: number = 3600000; // 1 hour

  checkLimit(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.window;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return true;
    }
    
    const timestamps = this.requests.get(key)!.filter(t => t > windowStart);
    timestamps.push(now);
    this.requests.set(key, timestamps);
    
    return timestamps.length <= this.limit;
  }

  getRemaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.window;
    
    if (!this.requests.has(key)) {
      return this.limit;
    }
    
    const timestamps = this.requests.get(key)!.filter(t => t > windowStart);
    return Math.max(0, this.limit - timestamps.length);
  }
}

export const rateLimiter = new RateLimiter();
