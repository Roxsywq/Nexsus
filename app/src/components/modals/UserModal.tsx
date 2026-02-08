import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Mail, Shield, Check } from 'lucide-react';
import type { UserFormData, UserRole, UserStatus } from '@/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: { name: string; email: string; role: UserRole; status: UserStatus } | null;
  mode: 'create' | 'edit';
}

const roles: { value: UserRole; label: string; color: string }[] = [
  { value: 'admin', label: 'Admin', color: 'text-nexus-red' },
  { value: 'moderator', label: 'Moderator', color: 'text-nexus-amber' },
  { value: 'user', label: 'User', color: 'text-nexus-emerald' },
];

const statuses: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'banned', label: 'Banned' },
  { value: 'pending', label: 'Pending' },
];

export function UserModal({ isOpen, onClose, onSubmit, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    status: 'pending',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'pending',
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-nexus-surface border border-nexus-surface-light rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-nexus-surface-light">
                <h2 className="text-xl font-semibold text-slate-100">
                  {mode === 'create' ? 'Create User' : 'Edit User'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className={`
                        w-full pl-10 pr-4 py-2.5 bg-nexus-surface-light/50 border rounded-xl
                        text-slate-100 placeholder-slate-500 focus:outline-none transition-all
                        ${errors.name 
                          ? 'border-nexus-red focus:border-nexus-red focus:ring-2 focus:ring-nexus-red/20' 
                          : 'border-nexus-surface-light focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20'
                        }
                      `}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-nexus-red">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Enter email address"
                      disabled={mode === 'edit'}
                      className={`
                        w-full pl-10 pr-4 py-2.5 bg-nexus-surface-light/50 border rounded-xl
                        text-slate-100 placeholder-slate-500 focus:outline-none transition-all
                        ${mode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}
                        ${errors.email 
                          ? 'border-nexus-red focus:border-nexus-red focus:ring-2 focus:ring-nexus-red/20' 
                          : 'border-nexus-surface-light focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20'
                        }
                      `}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-nexus-red">{errors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value as UserRole)}
                      className="w-full pl-10 pr-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all appearance-none cursor-pointer"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value} className="bg-nexus-surface">
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statuses.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleChange('status', status.value)}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all
                          ${formData.status === status.value
                            ? 'border-nexus-cyan bg-nexus-cyan/10 text-nexus-cyan'
                            : 'border-nexus-surface-light bg-nexus-surface-light/30 text-slate-400 hover:text-slate-200'
                          }
                        `}
                      >
                        <div className={`
                          w-2 h-2 rounded-full
                          ${status.value === 'active' ? 'bg-nexus-emerald' : ''}
                          ${status.value === 'inactive' ? 'bg-slate-400' : ''}
                          ${status.value === 'banned' ? 'bg-nexus-red' : ''}
                          ${status.value === 'pending' ? 'bg-nexus-amber' : ''}
                        `} />
                        <span className="text-sm font-medium">{status.label}</span>
                        {formData.status === status.value && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-nexus-surface-light text-slate-300 hover:bg-nexus-surface-light transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      mode === 'create' ? 'Create User' : 'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
