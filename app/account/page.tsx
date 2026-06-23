import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import Link from 'next/link';
import { User, Package, MapPin, CreditCard, Settings } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { formatStatus } from '@/lib/utils/format-status';

async function getUserData(userId: number) {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip_code: true,
      country: true,
      created_at: true,
    },
  });

  const ordersCount = await prisma.paymentOrder.count({
    where: { user_id: userId },
  });

  const recentOrders = await prisma.paymentOrder.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 3,
    include: {
      order_items: {
        include: {
          product: {
            select: {
              product_name: true,
              image_url: true,
            },
          },
        },
      },
    },
  });

  return { user, ordersCount, recentOrders };
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?redirect=/account');
  }

  const userId = parseInt(session.user.id);
  const { user, ordersCount, recentOrders } = await getUserData(userId);

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 bg-surface text-primary rounded-lg font-semibold"
                >
                  <User className="w-5 h-5" />
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Package className="w-5 h-5" />
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <MapPin className="w-5 h-5" />
                  Addresses
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{ordersCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Member Since</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                <Link
                  href="/account/settings"
                  className="text-primary hover:text-primary-light text-sm font-semibold"
                >
                  Edit
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                  <p className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                  <p className="font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Address</label>
                  <p className="font-semibold text-gray-900">
                    {user.address
                      ? `${user.address}, ${user.city || ''}, ${user.state || ''} ${user.zip_code || ''}`
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-primary hover:text-primary-light text-sm font-semibold"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    href="/products"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.order_id} className="border rounded-lg p-4 hover:border-accent transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.order_status === 'shipped'
                              ? 'bg-gray-100 text-primary'
                              : order.order_status === 'processing'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {formatStatus(order.order_status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-gray-900">Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <Link
                            href={`/account/orders/${order.order_id}`}
                            className="text-primary hover:text-primary-light text-sm font-semibold"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
