import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Key,
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';
import { settingsService } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';
import { ConfirmModal } from '@/components/modals';
import type { SystemSettings, ApiKey } from '@/types';

// Tabs
const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const { showSuccess, showError } = useNotification();

  // Load settings
  useEffect(() => {
    loadSettings();
    loadApiKeys();
  }, []);

  const loadSettings = async () => {
    const response = await settingsService.getSettings();
    if (response.success) {
      setSettings(response.data);
    }
  };

  const loadApiKeys = async () => {
    const response = await settingsService.getApiKeys();
    if (response.success) {
      setApiKeys(response.data);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsLoading(true);
    
    const response = await settingsService.updateSettings(settings);
    if (response.success) {
      showSuccess('Settings saved successfully');
    } else {
      showError(response.error?.message || 'Failed to save settings');
    }
    
    setIsLoading(false);
  };

  const handleUpdateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400">Manage your system preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30'
                  : 'bg-nexus-surface text-slate-400 border border-nexus-surface-light hover:text-slate-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
      >
        {activeTab === 'general' && settings && (
          <GeneralSettings 
            settings={settings} 
            onUpdate={handleUpdateSetting}
            onSave={handleSaveSettings}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'security' && settings && (
          <SecuritySettings 
            settings={settings} 
            onUpdate={handleUpdateSetting}
            onSave={handleSaveSettings}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'api' && (
          <ApiSettings 
            apiKeys={apiKeys} 
            onRefresh={loadApiKeys}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettings />
        )}
      </motion.div>
    </div>
  );
}

// General Settings
function GeneralSettings({ 
  settings, 
  onUpdate, 
  onSave, 
  isLoading 
}: { 
  settings: SystemSettings;
  onUpdate: (key: keyof SystemSettings, value: any) => void;
  onSave: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => onUpdate('siteName', e.target.value)}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => onUpdate('siteDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
            <div>
              <p className="font-medium text-slate-200">Maintenance Mode</p>
              <p className="text-sm text-slate-400">Disable public access to the site</p>
            </div>
            <Toggle 
              checked={settings.maintenanceMode} 
              onChange={(v) => onUpdate('maintenanceMode', v)} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
            <div>
              <p className="font-medium text-slate-200">Allow Registration</p>
              <p className="text-sm text-slate-400">Let new users create accounts</p>
            </div>
            <Toggle 
              checked={settings.allowRegistration} 
              onChange={(v) => onUpdate('allowRegistration', v)} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
            <div>
              <p className="font-medium text-slate-200">Require Email Verification</p>
              <p className="text-sm text-slate-400">Users must verify their email before accessing</p>
            </div>
            <Toggle 
              checked={settings.requireEmailVerification} 
              onChange={(v) => onUpdate('requireEmailVerification', v)} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Security Settings
function SecuritySettings({ 
  settings, 
  onUpdate, 
  onSave, 
  isLoading 
}: { 
  settings: SystemSettings;
  onUpdate: (key: keyof SystemSettings, value: any) => void;
  onSave: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Session Timeout (seconds)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => onUpdate('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Default: 3600 (1 hour)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => onUpdate('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Account will be locked after this many failed attempts</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rate Limit (requests per window)
            </label>
            <input
              type="number"
              value={settings.rateLimitRequests}
              onChange={(e) => onUpdate('rateLimitRequests', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rate Limit Window (seconds)
            </label>
            <input
              type="number"
              value={settings.rateLimitWindow}
              onChange={(e) => onUpdate('rateLimitWindow', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}

// API Settings
function ApiSettings({ 
  apiKeys, 
  onRefresh 
}: { 
  apiKeys: ApiKey[];
  onRefresh: () => void;
}) {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read']);
  const { showSuccess, showError } = useNotification();

  const permissions = ['read', 'write', 'delete'];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showSuccess('API key copied to clipboard');
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    const response = await settingsService.createApiKey(newKeyName, selectedPermissions);
    if (response.success) {
      showSuccess('API key created successfully');
      setIsCreateModalOpen(false);
      setNewKeyName('');
      setSelectedPermissions(['read']);
      onRefresh();
    } else {
      showError(response.error?.message || 'Failed to create API key');
    }
  };

  const handleRevokeKey = async (id: string) => {
    const response = await settingsService.revokeApiKey(id);
    if (response.success) {
      showSuccess('API key revoked successfully');
      onRefresh();
    } else {
      showError(response.error?.message || 'Failed to revoke API key');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">API Keys</h3>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-nexus-cyan/10 text-nexus-cyan rounded-lg hover:bg-nexus-cyan/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="p-4 bg-nexus-surface-light/30 rounded-xl border border-nexus-surface-light"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-slate-200">{key.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <code className="px-3 py-1 bg-nexus-background rounded-lg text-sm text-slate-400 font-mono">
                    {showKey === key.id ? key.key : key.prefix}
                  </code>
                  <button
                    onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-200 transition-colors"
                  >
                    {showKey === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleCopyKey(key.key)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                  {key.lastUsedAt && (
                    <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                  )}
                  <span className="flex items-center gap-1">
                    Permissions:
                    {key.permissions.map(p => (
                      <span key={p} className="px-1.5 py-0.5 bg-nexus-cyan/10 text-nexus-cyan rounded">
                        {p}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRevokeKey(key.id)}
                className="p-2 rounded-lg text-nexus-red hover:bg-nexus-red/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Create API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-2.5 bg-nexus-surface-light/50 border border-nexus-surface-light rounded-xl text-slate-100 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Permissions
                </label>
                <div className="flex gap-2">
                  {permissions.map((perm) => (
                    <button
                      key={perm}
                      onClick={() => {
                        setSelectedPermissions(prev =>
                          prev.includes(perm)
                            ? prev.filter(p => p !== perm)
                            : [...prev, perm]
                        );
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                        ${selectedPermissions.includes(perm)
                          ? 'bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30'
                          : 'bg-nexus-surface-light text-slate-400 border border-nexus-surface-light'
                        }
                      `}
                    >
                      {selectedPermissions.includes(perm) && <Check className="w-3 h-3 inline mr-1" />}
                      {perm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-nexus-surface-light text-slate-300 hover:bg-nexus-surface-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim() || selectedPermissions.length === 0}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Notification Settings
function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
          <div>
            <p className="font-medium text-slate-200">Email Notifications</p>
            <p className="text-sm text-slate-400">Receive updates via email</p>
          </div>
          <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
        </div>

        <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
          <div>
            <p className="font-medium text-slate-200">Push Notifications</p>
            <p className="text-sm text-slate-400">Browser push notifications</p>
          </div>
          <Toggle checked={pushNotifications} onChange={setPushNotifications} />
        </div>

        <div className="flex items-center justify-between p-4 bg-nexus-surface-light/30 rounded-xl">
          <div>
            <p className="font-medium text-slate-200">Weekly Reports</p>
            <p className="text-sm text-slate-400">Get weekly summary reports</p>
          </div>
          <Toggle checked={weeklyReports} onChange={setWeeklyReports} />
        </div>
      </div>
    </div>
  );
}

// Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-200
        ${checked ? 'bg-nexus-cyan' : 'bg-nexus-surface-light'}
      `}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}
