import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthState, LoginCredentials } from '@/types';
import { authService } from '@/services/api';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        
        if (response.success && response.data) {
          const stored = localStorage.getItem('nexus_auth');
          const auth = stored ? JSON.parse(stored) : null;
          
          setAuthState({
            isAuthenticated: true,
            user: response.data,
            token: auth?.token || null,
            refreshToken: auth?.refreshToken || null,
            expiresAt: auth?.expiresAt || null,
          });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!authState.expiresAt || !authState.refreshToken) return;

    const timeUntilExpiry = authState.expiresAt - Date.now();
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000; // Refresh 5 minutes before expiry

    if (refreshTime <= 0) return;

    const refreshTimer = setTimeout(async () => {
      try {
        const response = await authService.refreshToken(authState.refreshToken!);
        
        if (response.success) {
          setAuthState(prev => ({
            ...prev,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            expiresAt: response.data.expiresAt,
          }));
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        logout();
      }
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [authState.expiresAt, authState.refreshToken]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: response.data.expiresAt,
        });
      } else {
        setError(response.error?.message || 'Login failed');
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthState(initialAuthState);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success) {
        setAuthState(prev => ({
          ...prev,
          user: response.data,
        }));
      }
    } catch (err) {
      console.error('Refresh user failed:', err);
    }
  }, []);

  const value: AuthContextType = {
    authState,
    login,
    logout,
    refreshUser,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
