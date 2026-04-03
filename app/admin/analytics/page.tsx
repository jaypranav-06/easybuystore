'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Download,
  Calendar,
  Package,
  BarChart3,
} from 'lucide-react';
import SalesChart from '@/components/admin/SalesChart';
import PaymentMethodChart from '@/components/admin/PaymentMethodChart';
import OrderStatusChart from '@/components/admin/OrderStatusChart';
import Image from 'next/image';
import { LkrIcon } from '@/components/icons/LkrIcon';

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  chartData: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  paymentMethodData: Array<{
    method: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  statusData: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topProducts: Array<{
    product_id: number;
    product_name: string;
    category: string;
    quantity_sold: number;
    total_revenue: number;
    order_count: number;
    image_url: string | null;
  }>;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!data) return;

    const csvContent = [
      ['EasyBuyStore - Sales Report'],
      [`Period: ${period}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['Summary'],
      ['Total Revenue', `Rs ${data.summary.totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`],
      ['Total Orders', data.summary.totalOrders],
      ['Average Order Value', `Rs ${data.summary.averageOrderValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`],
      [],
      ['Date', 'Revenue', 'Orders'],
      ...data.chartData.map((item) => [
        item.label,
        item.revenue.toFixed(2),
        item.orders,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
          <p className="text-gray-600">Track your store performance and trends</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-medium"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 bg-white rounded-lg shadow-sm p-2 w-fit">
        {[
          { value: '7days', label: 'Last 7 Days' },
          { value: '30days', label: 'Last 30 Days' },
          { value: '90days', label: 'Last 90 Days' },
          { value: '12months', label: 'Last 12 Months' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setPeriod(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === option.value
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <LkrIcon className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            Rs {data.summary.totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{data.summary.totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Average Order Value</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            Rs {data.summary.averageOrderValue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sales Trend</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                chartType === 'area'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                chartType === 'line'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Line
            </button>
          </div>
        </div>
        <SalesChart data={data.chartData} type={chartType} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
          {data.paymentMethodData.length > 0 ? (
            <>
              <PaymentMethodChart data={data.paymentMethodData} />
              <div className="mt-6 space-y-2">
                {data.paymentMethodData.map((method, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{method.method}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        Rs {method.revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-600">{method.count} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No payment data</p>
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
          {data.statusData.length > 0 ? (
            <OrderStatusChart data={data.statusData} />
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No order data</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
        {data.topProducts.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No product sales data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantity Sold</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Orders</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((product, index) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url && (
                            <Image
                              src={product.image_url}
                              alt={product.product_name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{product.product_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900">{product.quantity_sold}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-700">{product.order_count}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-success">
                        Rs {product.total_revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-surface border border-primary rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-primary mb-1">About This Report</h3>
            <p className="text-primary text-sm">
              This analytics dashboard provides real-time insights into your store's sales performance.
              All revenue figures are based on paid orders only. Use the period selector to view
              different timeframes and export reports for record keeping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
