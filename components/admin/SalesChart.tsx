'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'area';
}

export default function SalesChart({ data, type = 'area' }: SalesChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-success">
            Revenue: Rs {payload[0].value.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-primary">Orders: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'line' ? LineChart : AreaChart;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis yAxisId="left" stroke="#10b981" style={{ fontSize: '12px' }} tickLine={false} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#3b82f6"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
          {type === 'area' ? (
            <>
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
                name="Revenue (Rs)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorOrders)"
                strokeWidth={2}
                name="Orders"
              />
            </>
          ) : (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue (Rs)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Orders"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
