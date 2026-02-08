import { useState, useCallback, useEffect } from 'react';
import type { User, UserFormData, QueryParams, PaginatedResponse } from '@/types';
import { userService } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';

interface UseUsersReturn {
  users: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: QueryParams) => Promise<void>;
  createUser: (data: UserFormData) => Promise<boolean>;
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  bulkDeleteUsers: (ids: string[]) => Promise<boolean>;
  getUserById: (id: string) => Promise<User | null>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  const fetchUsers = useCallback(async (params?: QueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getUsers(params);

      if (response.success) {
        setUsers(response.data.items);
        setMeta(response.data.meta);
      } else {
        setError(response.error?.message || 'Failed to fetch users');
        showError(response.error?.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      const message = err.message || 'Failed to fetch users';
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const createUser = useCallback(async (data: UserFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await userService.createUser(data);

      if (response.success) {
        setUsers(prev => [response.data, ...prev]);
        showSuccess('User created successfully');
        return true;
      } else {
        showError(response.error?.message || 'Failed to create user');
        return false;
      }
    } catch (err: any) {
      showError(err.message || 'Failed to create user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const updateUser = useCallback(async (id: string, data: Partial<UserFormData>): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await userService.updateUser(id, data);

      if (response.success) {
        setUsers(prev => 
          prev.map(user => user.id === id ? response.data : user)
        );
        showSuccess('User updated successfully');
        return true;
      } else {
        showError(response.error?.message || 'Failed to update user');
        return false;
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await userService.deleteUser(id);

      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        showSuccess('User deleted successfully');
        return true;
      } else {
        showError(response.error?.message || 'Failed to delete user');
        return false;
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const bulkDeleteUsers = useCallback(async (ids: string[]): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await userService.bulkDeleteUsers(ids);

      if (response.success) {
        setUsers(prev => prev.filter(user => !ids.includes(user.id)));
        showSuccess(`${ids.length} users deleted successfully`);
        return true;
      } else {
        showError(response.error?.message || 'Failed to delete users');
        return false;
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete users');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    try {
      const response = await userService.getUserById(id);

      if (response.success) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  return {
    users,
    meta,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    getUserById,
  };
}
