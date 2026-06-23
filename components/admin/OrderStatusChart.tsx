'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

interface OrderStatusChartProps {
  data: StatusData[];
}

const STATUS_COLORS: { [key: string]: string } = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  completed: '#10b981',
  cancelled: '#ef4444',
  failed: '#6b7280',
};

const STATUS_LABELS: { [key: string]: string } = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-700">Count: {payload[0].value}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => {
              const statusKey = data[index].status;
              return <Cell key={`cell-${index}`} fill={STATUS_COLORS[statusKey] || '#6b7280'} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
