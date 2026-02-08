import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import type { UserRole } from '@/types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  requiredRoles?: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    requiredRoles: ['admin', 'moderator'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    requiredRoles: ['admin', 'moderator'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
    requiredRoles: ['admin'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { authState, logout } = useAuth();
  const { showSuccess } = useNotification();
  const location = useLocation();
  const user = authState.user;

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
  };

  const filteredNavItems = navItems.filter(
    item => !item.requiredRoles || (user && item.requiredRoles.includes(user.role))
  );

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen bg-nexus-surface border-r border-nexus-surface-light z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-nexus-surface-light">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold gradient-text whitespace-nowrap"
            >
              NEXUS
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-nexus-cyan/10 text-nexus-cyan' 
                      : 'text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nexus-cyan rounded-r-full"
                      style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}
                    />
                  )}

                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-nexus-cyan' : ''}`} />
                  
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-nexus-surface-light rounded-lg text-sm text-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-nexus-surface-light">
                      {item.label}
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-nexus-cyan/20 text-nexus-cyan rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-nexus-surface-light">
        <div className={`
          flex items-center gap-3 p-3 rounded-xl bg-nexus-surface-light/50
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full border-2 border-nexus-cyan/30 flex-shrink-0"
          />
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 
            hover:bg-nexus-red/10 hover:text-nexus-red transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-nexus-cyan rounded-full flex items-center justify-center text-nexus-background hover:bg-nexus-cyan/80 transition-colors shadow-lg shadow-nexus-cyan/30"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
