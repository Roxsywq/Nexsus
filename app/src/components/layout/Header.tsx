import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  Check,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDistanceToNow } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  onSearch?: (query: string) => void;
}

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    title: 'New user registered',
    message: 'David Brown just created an account',
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    type: 'user' as const,
  },
  {
    id: '2',
    title: 'Server alert',
    message: 'CPU usage is above 80%',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    type: 'alert' as const,
  },
  {
    id: '3',
    title: 'Backup complete',
    message: 'Daily backup completed successfully',
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
    type: 'success' as const,
  },
];

export function Header({ onMenuClick, sidebarCollapsed, onSearch }: HeaderProps) {
  const location = useLocation();
  const { authState } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const user = authState.user;

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger search
  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        fixed top-0 right-0 h-16 z-40 transition-all duration-300
        ${sidebarCollapsed ? 'left-20' : 'left-[280px]'}
      `}
      style={{
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-slate-100">{getPageTitle()}</h1>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-nexus-cyan/50 focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-nexus-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-nexus-surface border border-nexus-surface-light rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-nexus-surface-light">
                      <h3 className="font-semibold text-slate-100">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-nexus-cyan hover:text-nexus-cyan/80 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`
                              relative p-4 border-b border-nexus-surface-light last:border-b-0
                              ${notification.read ? 'bg-transparent' : 'bg-nexus-cyan/5'}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                w-2 h-2 rounded-full mt-2 flex-shrink-0
                                ${notification.read ? 'bg-transparent' : 'bg-nexus-cyan'}
                              `} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-100">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {formatDistanceToNow(notification.time)}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 rounded hover:bg-nexus-surface-light text-slate-400 hover:text-nexus-cyan transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 rounded hover:bg-nexus-surface-light text-slate-400 hover:text-nexus-red transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <button className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Avatar (Mobile) */}
          <div className="lg:hidden">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-9 h-9 rounded-full border-2 border-nexus-cyan/30"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
