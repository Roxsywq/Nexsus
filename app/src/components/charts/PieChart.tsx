import { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface PieChartProps {
  data: ChartDataPoint[];
  height?: number;
  colors?: string[];
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

const defaultColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

// Active shape for hover effect
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#f8fafc" className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#94a3b8" className="text-xs">
        {value} ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export function PieChart({
  data,
  height = 300,
  colors = defaultColors,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 60,
  outerRadius = 100,
  showLabels = true,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
          }}
          labelStyle={{ color: '#f8fafc' }}
          itemStyle={{ color: '#94a3b8' }}
          formatter={(value: number, tooltipName: string) => [value.toLocaleString(), tooltipName]}
        />
        
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabels && activeIndex === null ? ({ percent }) => 
            `${(percent * 100).toFixed(0)}%`
          : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          activeIndex={activeIndex ?? undefined}
          activeShape={renderActiveShape}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="none"
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
