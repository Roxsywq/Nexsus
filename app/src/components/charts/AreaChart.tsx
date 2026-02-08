import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  strokeColor?: string;
  dataKey?: string;
  secondaryDataKey?: string;
}

export function AreaChart({
  data,
  height = 300,
  showGrid = true,
  gradientFrom = '#06b6d4',
  gradientTo = '#8b5cf6',
  strokeColor = '#06b6d4',
  dataKey = 'value',
  secondaryDataKey,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.3} />
            <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
          </linearGradient>
          {secondaryDataKey && (
            <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#1e293b" 
            vertical={false}
          />
        )}
        
        <XAxis 
          dataKey="name" 
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        
        <YAxis 
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => 
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
          }
        />
        
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
          }}
          labelStyle={{ color: '#f8fafc' }}
          itemStyle={{ color: '#94a3b8' }}
          formatter={(value: number) => [value.toLocaleString(), '']}
        />
        
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorGradient)"
          animationDuration={1500}
          animationEasing="ease-out"
        />
        
        {secondaryDataKey && (
          <Area
            type="monotone"
            dataKey={secondaryDataKey}
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGradient2)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
