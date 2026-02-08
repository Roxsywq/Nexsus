import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckSquare,
  Square,
  X,
  User,
  Shield,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { UserModal, ConfirmModal } from '@/components/modals';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatDistanceToNow, getInitials } from '@/lib/utils';
import type { User as UserType, UserRole, UserFormData } from '@/types';

// Status Badge Component
function StatusBadge({ status }: { status: UserType['status'] }) {
  const styles = {
    active: 'bg-nexus-emerald/10 text-nexus-emerald border-nexus-emerald/30',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    banned: 'bg-nexus-red/10 text-nexus-red border-nexus-red/30',
    pending: 'bg-nexus-amber/10 text-nexus-amber border-nexus-amber/30',
  };

  const icons = {
    active: UserCheck,
    inactive: UserX,
    banned: UserX,
    pending: Clock,
  };

  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status}</span>
    </span>
  );
}

// Role Badge Component
function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    admin: 'text-nexus-red',
    moderator: 'text-nexus-amber',
    user: 'text-nexus-emerald',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${styles[role]}`}>
      <Shield className="w-4 h-4" />
      <span className="capitalize">{role}</span>
    </span>
  );
}

export function Users() {
  const {
    users,
    meta,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
  } = useUsers();
  const { showSuccess, showError } = useNotification();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<UserType['status'] | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch users when filters change
  useEffect(() => {
    loadUsers();
  }, [debouncedSearch, selectedRole, selectedStatus, sortBy, sortOrder, currentPage]);

  const loadUsers = useCallback(() => {
    fetchUsers({
      page: currentPage,
      limit: 10,
      search: debouncedSearch,
      sortBy,
      sortOrder,
      filters: {
        ...(selectedRole !== 'all' && { role: selectedRole }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
      },
    });
  }, [debouncedSearch, selectedRole, selectedStatus, sortBy, sortOrder, currentPage, fetchUsers]);

  // Handlers
  const handleCreateUser = async (data: UserFormData) => {
    const success = await createUser(data);
    if (success) {
      setIsUserModalOpen(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    const success = await updateUser(selectedUser.id, data);
    if (success) {
      setIsUserModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const success = await deleteUser(selectedUser.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    const success = await bulkDeleteUsers(selectedUsers);
    if (success) {
      setSelectedUsers([]);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const openDeleteModal = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Users</h1>
          <p className="text-slate-400">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
          className="px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as UserType['status'] | 'all')}
          className="px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
          <option value="pending">Pending</option>
        </select>

        {/* Refresh */}
        <button
          onClick={loadUsers}
          disabled={isLoading}
          className="p-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-400 hover:text-slate-100 hover:border-nexus-cyan/50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-4 bg-nexus-cyan/10 border border-nexus-cyan/30 rounded-xl"
          >
            <span className="text-sm text-nexus-cyan">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-sm text-nexus-red hover:bg-nexus-red/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <div className="bg-nexus-surface border border-nexus-surface-light rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-nexus-surface-light">
                <th className="px-4 py-4">
                  <button
                    onClick={toggleAllSelection}
                    className="p-1 rounded hover:bg-nexus-surface-light transition-colors"
                  >
                    {selectedUsers.length === users.length && users.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-nexus-cyan" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-4 text-left text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    User
                    {sortBy === 'name' && (
                      <span className="text-nexus-cyan">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-4 py-4 text-left text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Role
                    {sortBy === 'role' && (
                      <span className="text-nexus-cyan">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-4 text-left text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortBy === 'status' && (
                      <span className="text-nexus-cyan">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lastActive')}
                  className="px-4 py-4 text-left text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Last Active
                    {sortBy === 'lastActive' && (
                      <span className="text-nexus-cyan">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-sm font-medium text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-nexus-surface-light last:border-b-0">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-12 bg-nexus-surface-light/50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <User className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                    <p className="text-slate-400">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-nexus-surface-light last:border-b-0 hover:bg-nexus-surface-light/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleUserSelection(user.id)}
                        className="p-1 rounded hover:bg-nexus-surface-light transition-colors"
                      >
                        {selectedUsers.includes(user.id) ? (
                          <CheckSquare className="w-5 h-5 text-nexus-cyan" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-nexus-surface-light"
                        />
                        <div>
                          <p className="font-medium text-slate-100">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-400">
                        {user.lastActive ? formatDistanceToNow(user.lastActive) : 'Never'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-nexus-cyan/10 hover:text-nexus-cyan transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-nexus-red/10 hover:text-nexus-red transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-nexus-surface-light">
          <p className="text-sm text-slate-400">
            Showing {users.length} of {meta.total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-400">
              Page {currentPage} of {meta.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
              disabled={currentPage === meta.totalPages}
              className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={modalMode === 'create' ? handleCreateUser : handleUpdateUser}
        user={selectedUser}
        mode={modalMode}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
