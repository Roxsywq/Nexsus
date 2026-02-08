import { useState, useCallback, useEffect, useRef } from 'react';
import type { DashboardStats, ChartDataPoint, ActivityItem } from '@/types';
import { dashboardService } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  userGrowth: ChartDataPoint[];
  trafficSources: ChartDataPoint[];
  revenue: ChartDataPoint[];
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  refreshCharts: () => Promise<void>;
  refreshActivities: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userGrowth, setUserGrowth] = useState<ChartDataPoint[]>([]);
  const [trafficSources, setTrafficSources] = useState<ChartDataPoint[]>([]);
  const [revenue, setRevenue] = useState<ChartDataPoint[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotification();
  
  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const response = await dashboardService.getStats();

      if (response.success && isMounted.current) {
        setStats(response.data);
      } else if (!response.success) {
        showError(response.error?.message || 'Failed to fetch stats');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to fetch stats');
    }
  }, [showError]);

  const refreshCharts = useCallback(async () => {
    try {
      const [growthRes, trafficRes, revenueRes] = await Promise.all([
        dashboardService.getUserGrowth(),
        dashboardService.getTrafficSources(),
        dashboardService.getRevenue(),
      ]);

      if (isMounted.current) {
        if (growthRes.success) setUserGrowth(growthRes.data);
        if (trafficRes.success) setTrafficSources(trafficRes.data);
        if (revenueRes.success) setRevenue(revenueRes.data);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to fetch chart data');
    }
  }, [showError]);

  const refreshActivities = useCallback(async () => {
    try {
      const response = await dashboardService.getActivities(10);

      if (response.success && isMounted.current) {
        setActivities(response.data);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to fetch activities');
    }
  }, [showError]);

  // Initial load
  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([
          refreshStats(),
          refreshCharts(),
          refreshActivities(),
        ]);
      } catch (err: any) {
        if (isMounted.current) {
          setError(err.message || 'Failed to load dashboard');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();
  }, [refreshStats, refreshCharts, refreshActivities]);

  // Real-time updates (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    userGrowth,
    trafficSources,
    revenue,
    activities,
    isLoading,
    error,
    refreshStats,
    refreshCharts,
    refreshActivities,
  };
}
