import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import OrderItemWithReview from '@/components/customer/OrderItemWithReview';
import { formatStatus } from '@/lib/utils/format-status';

async function getUserOrders(userId: number) {
  const orders = await prisma.paymentOrder.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
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

  // Get all reviews for this user
  const reviews = await prisma.review.findMany({
    where: { user_id: userId },
    select: {
      product_id: true,
      id: true,
    },
  });

  // Create a map of product_id to review existence
  const reviewedProducts = new Map(reviews.map(r => [r.product_id, true]));

  return { orders, reviewedProducts };
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?redirect=/account/orders');
  }

  const userId = parseInt(session.user.id);
  const { orders, reviewedProducts } = await getUserOrders(userId);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-primary hover:text-primary-light mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Order Number</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date Placed</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'stripe' ? 'Stripe' : order.payment_method || 'PayPal'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <div className="flex flex-col gap-1 items-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.order_status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : order.order_status === 'shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : order.order_status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.order_status === 'pending'
                                ? 'bg-gray-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {formatStatus(order.order_status)}
                          </span>
                          {order.payment_status === 'paid' && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                              ✓ Paid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <OrderItemWithReview
                        key={item.id}
                        item={item}
                        orderId={order.order_id}
                        orderStatus={order.order_status}
                        hasReviewed={reviewedProducts.has(item.product_id)}
                      />
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {order.tracking_number && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-900">Tracking:</span>
                        <span className="font-mono text-green-700">{order.tracking_number}</span>
                        {order.carrier && (
                          <span className="text-green-600">via {order.carrier}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {order.shipping_address && (
                        <div>
                          <span className="font-semibold text-gray-900">Shipping to:</span>{' '}
                          {order.shipping_address}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/account/orders/${order.order_id}`}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        {order.tracking_number ? 'Track Order' : 'View Details'}
                      </Link>
                      {order.order_status === 'completed' && (
                        <Link
                          href={`/products`}
                          className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary transition"
                        >
                          Buy Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
