import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { Package, Eye } from 'lucide-react';

async function getOrders() {
  const orders = await prisma.paymentOrder.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      order_items: {
        include: {
          product: {
            select: {
              product_name: true,
            },
          },
        },
      },
    },
  });

  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

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
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
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
                      Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-orange-700'
                        }`}
                      >
                        {order.payment_status}
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
                        {order.order_status}
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
