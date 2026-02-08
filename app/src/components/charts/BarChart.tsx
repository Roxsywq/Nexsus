import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  colors?: string[];
  dataKey?: string;
  horizontal?: boolean;
}

const defaultColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export function BarChart({
  data,
  height = 300,
  showGrid = true,
  colors = defaultColors,
  dataKey = 'value',
  horizontal = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#1e293b" 
            horizontal={!horizontal}
            vertical={horizontal}
          />
        )}
        
        <XAxis 
          type={horizontal ? 'number' : 'category'}
          dataKey={horizontal ? undefined : 'name'}
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        
        <YAxis 
          type={horizontal ? 'category' : 'number'}
          dataKey={horizontal ? 'name' : undefined}
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={horizontal ? 80 : undefined}
        />
        
        <Tooltip
          cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }}
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
        
        <Bar 
          dataKey={dataKey} 
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
