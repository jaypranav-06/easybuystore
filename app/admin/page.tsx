import prisma from '@/lib/db/prisma';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatStatus } from '@/lib/utils/format-status';
import { LkrIcon } from '@/components/icons/LkrIcon';

async function getDashboardStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.product.count({ where: { is_active: true } }),
    prisma.paymentOrder.count(),
    prisma.user.count(),
    prisma.paymentOrder.count({ where: { order_status: 'pending' } }),
    prisma.product.count({
      where: {
        is_active: true,
        stock_quantity: { lte: 10, gt: 0 },
      },
    }),
    prisma.paymentOrder.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    }),
    prisma.paymentOrder.aggregate({
      _sum: {
        total: true,
      },
      where: {
        payment_status: 'paid',
      },
    }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs ${Number(stats.totalRevenue).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: LkrIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-success',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-surface0',
      bgColor: 'bg-surface',
      textColor: 'text-primary',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-accent',
      bgColor: 'bg-surface',
      textColor: 'text-accent',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-accent',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=pending">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Pending Orders</h3>
                    <p className="text-gray-600 text-sm">
                      You have {stats.pendingOrders} pending {stats.pendingOrders === 1 ? 'order' : 'orders'} that need attention
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {stats.lowStockProducts > 0 && (
            <Link href="/admin/products?stock=low">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Low Stock Alert</h3>
                    <p className="text-gray-600 text-sm">
                      {stats.lowStockProducts} {stats.lowStockProducts === 1 ? 'product is' : 'products are'} running low on stock
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary hover:text-primary-light font-semibold text-sm">
            View All
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {order.user.first_name} {order.user.last_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/orders/${order.order_number}`}
                        className="text-primary hover:text-primary-light text-sm font-semibold"
                      >
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
