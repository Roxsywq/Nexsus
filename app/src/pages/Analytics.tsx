import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import { AreaChart, BarChart, PieChart } from '@/components/charts';
import { useDashboard } from '@/hooks/useDashboard';
import { formatNumber, formatPercentage } from '@/lib/utils';

// Mock data for analytics
const pageViewsData = [
  { name: 'Mon', value: 4500 },
  { name: 'Tue', value: 5200 },
  { name: 'Wed', value: 4800 },
  { name: 'Thu', value: 6100 },
  { name: 'Fri', value: 7200 },
  { name: 'Sat', value: 5800 },
  { name: 'Sun', value: 4900 },
];

const bounceRateData = [
  { name: 'Home', value: 35 },
  { name: 'Products', value: 42 },
  { name: 'About', value: 28 },
  { name: 'Contact', value: 45 },
  { name: 'Blog', value: 38 },
];

const deviceData = [
  { name: 'Desktop', value: 55 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 10 },
];

const browserData = [
  { name: 'Chrome', value: 62 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 12 },
  { name: 'Edge', value: 8 },
];

const topPages = [
  { path: '/', views: 12500, avgTime: '2:45' },
  { path: '/products', views: 8200, avgTime: '4:12' },
  { path: '/pricing', views: 6100, avgTime: '3:30' },
  { path: '/about', views: 4300, avgTime: '1:50' },
  { path: '/contact', views: 3200, avgTime: '2:15' },
];

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: 'cyan' | 'violet' | 'emerald' | 'amber' | 'blue' | 'pink';
  delay?: number;
}

function StatCard({ title, value, change, icon: Icon, color, delay = 0 }: StatCardProps) {
  const colorClasses = {
    cyan: 'from-nexus-cyan/20 to-nexus-cyan/5 text-nexus-cyan',
    violet: 'from-nexus-violet/20 to-nexus-violet/5 text-nexus-violet',
    emerald: 'from-nexus-emerald/20 to-nexus-emerald/5 text-nexus-emerald',
    amber: 'from-nexus-amber/20 to-nexus-amber/5 text-nexus-amber',
    blue: 'from-nexus-blue/20 to-nexus-blue/5 text-nexus-blue',
    pink: 'from-nexus-pink/20 to-nexus-pink/5 text-nexus-pink',
  };

  const isPositive = change && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6 hover:border-nexus-cyan/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-nexus-emerald' : 'text-nexus-red'}`}>
              <span>{isPositive ? '+' : ''}{change}%</span>
              <span className="text-slate-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export function Analytics() {
  const { userGrowth, trafficSources, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-4 border-nexus-cyan/30 border-t-nexus-cyan rounded-full"
          />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400">Track your application performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Page Views"
          value={formatNumber(45200)}
          change={12.5}
          icon={Eye}
          color="cyan"
          delay={0}
        />
        <StatCard
          title="Unique Visitors"
          value={formatNumber(18200)}
          change={8.3}
          icon={Users}
          color="violet"
          delay={0.1}
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          change={-2.1}
          icon={Clock}
          color="amber"
          delay={0.2}
        />
        <StatCard
          title="Bounce Rate"
          value="42.3%"
          change={-5.2}
          icon={TrendingUp}
          color="emerald"
          delay={0.3}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Page Views</h3>
              <p className="text-sm text-slate-400">Daily page views over the week</p>
            </div>
          </div>
          <AreaChart data={pageViewsData} height={280} gradientFrom="#8b5cf6" gradientTo="#ec4899" strokeColor="#8b5cf6" />
        </motion.div>

        {/* Bounce Rate by Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Bounce Rate by Page</h3>
              <p className="text-sm text-slate-400">Percentage of visitors who leave after one page</p>
            </div>
          </div>
          <BarChart data={bounceRateData} height={280} colors={['#f59e0b']} />
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Devices</h3>
              <p className="text-sm text-slate-400">User device breakdown</p>
            </div>
          </div>
          <PieChart data={deviceData} height={200} innerRadius={40} outerRadius={80} />
          <div className="mt-4 space-y-2">
            {deviceData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {device.name === 'Desktop' && <Monitor className="w-4 h-4 text-slate-400" />}
                  {device.name === 'Mobile' && <Smartphone className="w-4 h-4 text-slate-400" />}
                  {device.name === 'Tablet' && <Tablet className="w-4 h-4 text-slate-400" />}
                  <span className="text-slate-300">{device.name}</span>
                </div>
                <span className="text-slate-400">{device.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Browser Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Browsers</h3>
              <p className="text-sm text-slate-400">Browser usage statistics</p>
            </div>
          </div>
          <PieChart data={browserData} height={200} innerRadius={40} outerRadius={80} />
          <div className="mt-4 space-y-2">
            {browserData.map((browser) => (
              <div key={browser.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{browser.name}</span>
                <span className="text-slate-400">{browser.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Top Pages</h3>
              <p className="text-sm text-slate-400">Most visited pages</p>
            </div>
          </div>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-3 bg-nexus-surface-light/30 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-nexus-cyan/10 text-nexus-cyan rounded-lg text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-300 font-mono">{page.path}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-200">{formatNumber(page.views)}</p>
                  <p className="text-xs text-slate-500">{page.avgTime} avg</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Geographic Distribution</h3>
            <p className="text-sm text-slate-400">User locations</p>
          </div>
          <Globe className="w-5 h-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { country: 'United States', users: 8500, flag: '🇺🇸' },
            { country: 'United Kingdom', users: 4200, flag: '🇬🇧' },
            { country: 'Germany', users: 3800, flag: '🇩🇪' },
            { country: 'France', users: 2900, flag: '🇫🇷' },
            { country: 'Canada', users: 2400, flag: '🇨🇦' },
            { country: 'Australia', users: 1800, flag: '🇦🇺' },
          ].map((item) => (
            <div
              key={item.country}
              className="p-4 bg-nexus-surface-light/30 rounded-xl text-center"
            >
              <span className="text-2xl">{item.flag}</span>
              <p className="text-sm text-slate-300 mt-2">{item.country}</p>
              <p className="text-lg font-semibold text-slate-100">{formatNumber(item.users)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
