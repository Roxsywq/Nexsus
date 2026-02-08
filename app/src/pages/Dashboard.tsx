import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  Activity,
  Server,
  TrendingUp,
  TrendingDown,
  UserPlus,
  LogIn,
  Edit3,
  Trash2,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { AreaChart, BarChart, PieChart } from '@/components/charts';
import { formatNumber, formatCurrency, formatPercentage, formatDistanceToNow } from '@/lib/utils';
import type { ActivityItem } from '@/types';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: 'cyan' | 'violet' | 'emerald' | 'amber';
  delay?: number;
}

function StatCard({ title, value, change, icon: Icon, color, delay = 0 }: StatCardProps) {
  const colorClasses = {
    cyan: 'from-nexus-cyan/20 to-nexus-cyan/5 text-nexus-cyan',
    violet: 'from-nexus-violet/20 to-nexus-violet/5 text-nexus-violet',
    emerald: 'from-nexus-emerald/20 to-nexus-emerald/5 text-nexus-emerald',
    amber: 'from-nexus-amber/20 to-nexus-amber/5 text-nexus-amber',
  };

  const isPositive = change && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6 hover:border-nexus-cyan/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-nexus-emerald' : 'text-nexus-red'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{formatPercentage(change)}</span>
              <span className="text-slate-500 ml-1">vs last month</span>
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

// Activity Icon Component
function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const icons = {
    user_created: { icon: UserPlus, color: 'text-nexus-emerald bg-nexus-emerald/10' },
    user_updated: { icon: Edit3, color: 'text-nexus-blue bg-nexus-blue/10' },
    user_deleted: { icon: Trash2, color: 'text-nexus-red bg-nexus-red/10' },
    login: { icon: LogIn, color: 'text-nexus-cyan bg-nexus-cyan/10' },
    logout: { icon: LogIn, color: 'text-slate-400 bg-slate-400/10' },
    api_call: { icon: Activity, color: 'text-nexus-violet bg-nexus-violet/10' },
    error: { icon: AlertCircle, color: 'text-nexus-red bg-nexus-red/10' },
  };

  const { icon: Icon, color } = icons[type];
  return (
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

export function Dashboard() {
  const { stats, userGrowth, trafficSources, revenue, activities, isLoading } = useDashboard();
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    revenue: 0,
    activeSessions: 0,
    serverLoad: 0,
  });

  // Animate numbers on load
  useEffect(() => {
    if (stats) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          totalUsers: Math.floor(stats.totalUsers * easeOut),
          revenue: Math.floor(stats.revenue * easeOut),
          activeSessions: Math.floor(stats.activeSessions * easeOut),
          serverLoad: Math.floor(stats.serverLoad * easeOut),
        });

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedStats({
            totalUsers: stats.totalUsers,
            revenue: stats.revenue,
            activeSessions: stats.activeSessions,
            serverLoad: stats.serverLoad,
          });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-4 border-nexus-cyan/30 border-t-nexus-cyan rounded-full"
          />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={formatNumber(animatedStats.totalUsers)}
          change={stats?.totalUsersChange}
          icon={Users}
          color="cyan"
          delay={0}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(animatedStats.revenue)}
          change={stats?.revenueChange}
          icon={DollarSign}
          color="emerald"
          delay={0.1}
        />
        <StatCard
          title="Active Sessions"
          value={formatNumber(animatedStats.activeSessions)}
          change={stats?.activeSessionsChange}
          icon={Activity}
          color="violet"
          delay={0.2}
        />
        <StatCard
          title="Server Load"
          value={`${animatedStats.serverLoad}%`}
          icon={Server}
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">User Growth</h3>
              <p className="text-sm text-slate-400">Monthly active users over time</p>
            </div>
            <button className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <AreaChart data={userGrowth} height={280} secondaryDataKey="value2" />
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Traffic Sources</h3>
              <p className="text-sm text-slate-400">Where users come from</p>
            </div>
          </div>
          <PieChart data={trafficSources} height={250} />
          <div className="mt-4 space-y-2">
            {trafficSources.map((source, index) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][index],
                    }}
                  />
                  <span className="text-slate-300">{source.name}</span>
                </div>
                <span className="text-slate-400">{source.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Weekly Revenue</h3>
              <p className="text-sm text-slate-400">Revenue breakdown by day</p>
            </div>
          </div>
          <BarChart data={revenue} height={250} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Recent Activity</h3>
              <p className="text-sm text-slate-400">Latest system events</p>
            </div>
            <button className="text-sm text-nexus-cyan hover:text-nexus-cyan/80 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4 max-h-[280px] overflow-y-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-nexus-surface-light/50 transition-colors"
              >
                <ActivityIcon type={activity.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{activity.description}</p>
                  {activity.userName && (
                    <p className="text-xs text-slate-400 mt-0.5">by {activity.userName}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
