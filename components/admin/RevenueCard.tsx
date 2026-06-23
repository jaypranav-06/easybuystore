'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

interface MonthRow {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  changePercent: number | null;
  months: MonthRow[];
  rows: MonthRow[];
}

const fmt = (n: number) =>
  `Rs ${n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function RevenueCard() {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/revenue?month=${selectedMonth}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedMonth]);

  const change = data?.changePercent;
  const isUp = change !== null && change !== undefined && change > 0;
  const isDown = change !== null && change !== undefined && change < 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 col-span-full lg:col-span-2">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          {loading ? (
            <div className="h-9 w-44 bg-gray-100 animate-pulse rounded" />
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <p className="text-3xl font-bold text-gray-900">
                {fmt(data?.totalRevenue || 0)}
              </p>
              {change !== null && change !== undefined && (
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isUp ? 'text-green-600' : isDown ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(change).toFixed(1)}% vs prev month
                </span>
              )}
            </div>
          )}
          {!loading && data && (
            <p className="text-xs text-gray-400 mt-1">{data.totalOrders} paid orders</p>
          )}
        </div>

        {/* Month filter */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="all">All months</option>
            {data?.months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : !data || data.rows.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No revenue data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Month</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Orders</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Revenue</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Avg. Order</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const avg = row.orders > 0 ? row.revenue / row.orders : 0;
                const isCurrentMonth =
                  row.key ===
                  `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
                return (
                  <tr
                    key={row.key}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition ${
                      isCurrentMonth ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {row.label}
                      {isCurrentMonth && (
                        <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-600">{row.orders}</td>
                    <td className="py-3 px-3 text-right font-semibold text-gray-900">
                      {fmt(row.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-500">{fmt(avg)}</td>
                  </tr>
                );
              })}
            </tbody>
            {selectedMonth === 'all' && data.rows.length > 1 && (
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td className="py-3 px-3 font-bold text-gray-900">Total</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">{data.totalOrders}</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">{fmt(data.totalRevenue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-500">
                    {fmt(data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
