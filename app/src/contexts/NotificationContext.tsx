import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      dismissible: true,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  }, []);

  const showSuccess = useCallback((message: string, title: string = 'Success') => {
    showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((message: string, title: string = 'Error') => {
    showNotification('error', title, message, 8000);
  }, [showNotification]);

  const showWarning = useCallback((message: string, title: string = 'Warning') => {
    showNotification('warning', title, message, 7000);
  }, [showNotification]);

  const showInfo = useCallback((message: string, title: string = 'Info') => {
    showNotification('info', title, message);
  }, [showNotification]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
    </NotificationContext.Provider>
  );
}

function ToastContainer({ 
  notifications, 
  onDismiss 
}: { 
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-nexus-emerald" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-nexus-red" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-nexus-amber" />;
      case 'info':
        return <Info className="w-5 h-5 text-nexus-blue" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-nexus-emerald/10 border-nexus-emerald/30 text-nexus-emerald';
      case 'error':
        return 'bg-nexus-red/10 border-nexus-red/30 text-nexus-red';
      case 'warning':
        return 'bg-nexus-amber/10 border-nexus-amber/30 text-nexus-amber';
      case 'info':
        return 'bg-nexus-blue/10 border-nexus-blue/30 text-nexus-blue';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30,
              layout: { duration: 0.2 }
            }}
            className={`
              relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
              shadow-lg shadow-black/20
              ${getStyles(notification.type)}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-slate-100">
                {notification.title}
              </h4>
              <p className="text-sm text-slate-300 mt-1">
                {notification.message}
              </p>
            </div>

            {notification.dismissible && (
              <button
                onClick={() => onDismiss(notification.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Progress bar */}
            {(notification.duration ?? 0) > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-30"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: (notification.duration ?? 5000) / 1000, ease: 'linear' }}
                style={{ originX: 0 }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}
