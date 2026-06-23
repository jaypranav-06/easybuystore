'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PaymentMethodData {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = data.map((item) => ({
    name: item.method,
    value: item.count,
    revenue: item.revenue,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].name}</p>
          <p className="text-sm text-gray-700">Orders: {payload[0].value}</p>
          <p className="text-sm text-success">
            Revenue: Rs {payload[0].payload.revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">
            {((payload[0].value / data.reduce((sum, d) => sum + d.count, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / data.reduce((sum, d) => sum + d.count, 0)) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
