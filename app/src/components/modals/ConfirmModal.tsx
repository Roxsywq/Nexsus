import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2, Check } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-nexus-red" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-nexus-amber" />;
      case 'info':
        return <Check className="w-6 h-6 text-nexus-blue" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-nexus-red/10',
          button: 'bg-nexus-red hover:bg-nexus-red/90',
        };
      case 'warning':
        return {
          iconBg: 'bg-nexus-amber/10',
          button: 'bg-nexus-amber hover:bg-nexus-amber/90',
        };
      case 'info':
        return {
          iconBg: 'bg-nexus-blue/10',
          button: 'bg-nexus-blue hover:bg-nexus-blue/90',
        };
    }
  };

  const colors = getColors();

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-nexus-surface border border-nexus-surface-light rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-nexus-surface-light">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                    {getIcon()}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-300 leading-relaxed">{message}</p>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-nexus-surface-light text-slate-300 hover:bg-nexus-surface-light transition-colors disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`
                      flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-opacity
                      flex items-center justify-center gap-2
                      ${colors.button}
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                    `}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
