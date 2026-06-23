'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Eye } from 'lucide-react';
import { formatStatus } from '@/lib/utils/format-status';

type Period = 'all' | 'today' | 'last_week' | 'last_month';
type PriceSort = 'none' | 'asc' | 'desc';

interface Order {
  order_id: number;
  order_number: string;
  total: number;
  payment_status: string | null;
  order_status: string;
  created_at: string;
  user: { first_name: string; last_name: string; email: string };
  order_items: { id: number }[];
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'today', label: 'Today' },
  { value: 'last_week', label: 'Last 7 Days' },
  { value: 'last_month', label: 'Last 30 Days' },
];

function filterAndSort(orders: Order[], period: Period, priceSort: PriceSort): Order[] {
  let result = orders;

  if (period !== 'all') {
    const now = new Date();
    let cutoff: Date;
    if (period === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'last_week') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    result = result.filter((o) => new Date(o.created_at) >= cutoff);
  }

  if (priceSort === 'asc') {
    result = [...result].sort((a, b) => a.total - b.total);
  } else if (priceSort === 'desc') {
    result = [...result].sort((a, b) => b.total - a.total);
  }

  return result;
}

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [priceSort, setPriceSort] = useState<PriceSort>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((res) => { if (res.success) setAllOrders(res.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const orders = filterAndSort(allOrders, period, priceSort);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === 'pending').length,
    processing: orders.filter((o) => o.order_status === 'processing').length,
    shipped: orders.filter((o) => o.order_status === 'shipped').length,
    completed: orders.filter((o) => o.order_status === 'completed').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Period */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                period === p.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Price sort */}
        <div className="flex gap-2">
          <button
            onClick={() => setPriceSort(priceSort === 'asc' ? 'none' : 'asc')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              priceSort === 'asc'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Price: Low to High
          </button>
          <button
            onClick={() => setPriceSort(priceSort === 'desc' ? 'none' : 'desc')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              priceSort === 'desc'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Price: High to Low
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-accent mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-yellow-600 mb-1">Processing</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.processing}</p>
        </div>
        <div className="bg-surface rounded-lg shadow-sm p-4">
          <p className="text-sm text-primary mb-1">Shipped</p>
          <p className="text-2xl font-bold text-primary">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-success mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-gray-900 text-sm">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.user.first_name} {order.user.last_name}
                        </p>
                        <p className="text-xs text-gray-600">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-gray-900 text-sm">
                      {order.order_items.length}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900 text-sm">
                      Rs {Number(order.total).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-orange-700'
                        }`}
                      >
                        {formatStatus(order.payment_status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.order_status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.order_status === 'shipped'
                            ? 'bg-gray-100 text-primary'
                            : order.order_status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-orange-700'
                        }`}
                      >
                        {formatStatus(order.order_status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/orders/${order.order_number}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-light font-semibold text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
