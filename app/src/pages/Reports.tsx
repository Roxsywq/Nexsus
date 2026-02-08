import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ChevronDown,
  Check,
  Printer,
  Share2,
} from 'lucide-react';
import { AreaChart, BarChart } from '@/components/charts';
import { formatNumber, formatCurrency, formatDate } from '@/lib/utils';

// Report types
const reportTypes = [
  { id: 'users', label: 'User Report', icon: Users },
  { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
  { id: 'activity', label: 'Activity Report', icon: Activity },
  { id: 'growth', label: 'Growth Report', icon: TrendingUp },
];

// Date ranges
const dateRanges = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: '1y', label: 'Last Year' },
  { id: 'custom', label: 'Custom Range' },
];

// Mock report data
const mockReportData = {
  users: {
    summary: {
      totalUsers: 24593,
      newUsers: 1847,
      activeUsers: 12450,
      churnRate: 2.3,
    },
    chartData: [
      { name: 'Jan', value: 15000, value2: 12000 },
      { name: 'Feb', value: 18000, value2: 14000 },
      { name: 'Mar', value: 22000, value2: 17000 },
      { name: 'Apr', value: 21000, value2: 19000 },
      { name: 'May', value: 24593, value2: 21000 },
      { name: 'Jun', value: 28000, value2: 24000 },
    ],
  },
  revenue: {
    summary: {
      totalRevenue: 842000,
      monthlyRevenue: 84200,
      avgOrderValue: 125,
      conversionRate: 3.2,
    },
    chartData: [
      { name: 'Jan', value: 65000 },
      { name: 'Feb', value: 72000 },
      { name: 'Mar', value: 78000 },
      { name: 'Apr', value: 81000 },
      { name: 'May', value: 84200 },
      { name: 'Jun', value: 92000 },
    ],
  },
  activity: {
    summary: {
      totalSessions: 125000,
      avgSessionDuration: '4m 32s',
      pageViews: 452000,
      bounceRate: 42.3,
    },
    chartData: [
      { name: 'Mon', value: 18000 },
      { name: 'Tue', value: 22000 },
      { name: 'Wed', value: 20000 },
      { name: 'Thu', value: 25000 },
      { name: 'Fri', value: 28000 },
      { name: 'Sat', value: 15000 },
      { name: 'Sun', value: 13000 },
    ],
  },
  growth: {
    summary: {
      mrrGrowth: 15.2,
      userGrowth: 12.8,
      revenueGrowth: 18.5,
      retentionRate: 87.3,
    },
    chartData: [
      { name: 'Q1', value: 12 },
      { name: 'Q2', value: 15 },
      { name: 'Q3', value: 18 },
      { name: 'Q4', value: 22 },
    ],
  },
};

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('users');
  const [selectedRange, setSelectedRange] = useState('30d');
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportData = mockReportData[selectedReport as keyof typeof mockReportData];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Simulate export
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Reports</h1>
          <p className="text-slate-400">Generate and export detailed reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-300 hover:text-slate-100 hover:border-nexus-cyan/50 transition-all"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-300 hover:text-slate-100 hover:border-nexus-cyan/50 transition-all"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-300 hover:text-slate-100 hover:border-nexus-cyan/50 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Report Type */}
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                  ${selectedReport === type.id
                    ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30'
                    : 'bg-nexus-surface text-slate-400 border border-nexus-surface-light hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Date Range */}
        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-nexus-surface border border-nexus-surface-light rounded-xl text-slate-300 hover:text-slate-100 transition-all"
          >
            <Calendar className="w-4 h-4" />
            {dateRanges.find(r => r.id === selectedRange)?.label}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showRangeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-nexus-surface border border-nexus-surface-light rounded-xl shadow-xl z-10">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => {
                    setSelectedRange(range.id);
                    setShowRangeDropdown(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors
                    ${selectedRange === range.id
                      ? 'text-nexus-cyan bg-nexus-cyan/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-nexus-surface-light'
                    }
                    first:rounded-t-xl last:rounded-b-xl
                  `}
                >
                  {selectedRange === range.id && <Check className="w-4 h-4" />}
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Report Content */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(reportData.summary).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-5"
            >
              <p className="text-sm text-slate-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-2xl font-bold text-slate-100 mt-1">
                {typeof value === 'number' && key.toLowerCase().includes('revenue')
                  ? formatCurrency(value)
                  : typeof value === 'number'
                    ? formatNumber(value)
                    : value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-nexus-surface border border-nexus-surface-light rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                {reportTypes.find(t => t.id === selectedReport)?.label} Overview
              </h3>
              <p className="text-sm text-slate-400">
                {dateRanges.find(r => r.id === selectedRange)?.label}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-slate-400 hover:bg-nexus-surface-light hover:text-slate-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {selectedReport === 'growth' ? (
            <BarChart data={reportData.chartData} height={350} colors={['#06b6d4']} />
          ) : (
            <AreaChart 
              data={reportData.chartData} 
              height={350}
              secondaryDataKey={selectedReport === 'users' ? 'value2' : undefined}
            />
          )}
        </div>

        {/* Detailed Data Table */}
        <div className="bg-nexus-surface border border-nexus-surface-light rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-nexus-surface-light">
            <h3 className="text-lg font-semibold text-slate-100">Detailed Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nexus-surface-light">
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Period</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-400">Value</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-400">Change</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {reportData.chartData.map((item, index) => {
                  const prevValue = index > 0 ? reportData.chartData[index - 1].value : item.value;
                  const change = ((item.value - prevValue) / prevValue) * 100;
                  const isPositive = change >= 0;

                  return (
                    <tr key={item.name} className="border-b border-nexus-surface-light last:border-b-0">
                      <td className="px-6 py-3 text-slate-200">{item.name}</td>
                      <td className="px-6 py-3 text-right text-slate-200">
                        {formatNumber(item.value)}
                      </td>
                      <td className={`px-6 py-3 text-right ${isPositive ? 'text-nexus-emerald' : 'text-nexus-red'}`}>
                        {index > 0 ? `${isPositive ? '+' : ''}${change.toFixed(1)}%` : '-'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {index > 0 && (
                          <div className={`inline-flex items-center gap-1 ${isPositive ? 'text-nexus-emerald' : 'text-nexus-red'}`}>
                            {isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4 rotate-180" />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
