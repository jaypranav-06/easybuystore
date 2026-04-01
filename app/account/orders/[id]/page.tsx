import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { formatStatus } from '@/lib/utils/format-status';

async function getOrderDetails(orderId: number, userId: number) {
  const order = await prisma.paymentOrder.findFirst({
    where: {
      order_id: orderId,
      user_id: userId,
    },
    include: {
      order_items: {
        include: {
          product: {
            select: {
              product_name: true,
              image_url: true,
              product_id: true,
            },
          },
        },
      },
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  });

  return order;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?redirect=/account/orders');
  }

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    notFound();
  }

  const userId = parseInt(session.user.id);
  const order = await getOrderDetails(orderId, userId);

  if (!order) {
    notFound();
  }

  const orderProgress = [
    { label: 'Order Placed', status: 'completed', icon: Package },
    {
      label: 'Processing',
      status: order.order_status === 'pending' ? 'pending' : 'completed',
      icon: CheckCircle,
    },
    {
      label: 'Shipped',
      status:
        order.order_status === 'shipped' || order.order_status === 'completed'
          ? 'completed'
          : 'pending',
      icon: Truck,
    },
    {
      label: 'Delivered',
      status: order.order_status === 'completed' ? 'completed' : 'pending',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center text-primary hover:text-primary-light mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
          </div>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
          <div className="flex items-center justify-between">
            {orderProgress.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < orderProgress.length - 1 && (
                    <div
                      className={`h-1 flex-1 -mt-8 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-6">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b last:border-0">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.product_name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-semibold text-gray-900 hover:text-primary text-lg"
                    >
                      {item.product?.product_name || 'Product'}
                    </Link>
                    <p className="text-gray-600 mt-2">
                      Quantity: <span className="font-semibold">{item.quantity}</span>
                    </p>
                    <p className="text-gray-600">
                      Price: <span className="font-semibold">Rs {Number(item.price).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Rs {Number(item.subtotal).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    $
                    {order.order_items
                      .reduce((sum, item) => sum + Number(item.subtotal), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs {Number(order.shipping || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Rs {Number(order.tax || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {order.discount && Number(order.discount) > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-Rs {Number(order.discount).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
              <div className="text-gray-600">
                <p className="font-semibold text-gray-900 mb-2">
                  {order.user.first_name} {order.user.last_name}
                </p>
                {order.shipping_address && (
                  <p className="mb-2 whitespace-pre-line">{order.shipping_address}</p>
                )}
                <p>{order.user.email}</p>
              </div>
            </div>

            {/* Tracking Information */}
            {order.tracking_number && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Tracking Information
                </h2>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-900">Package Shipped</p>
                    </div>
                    <p className="text-sm text-green-700">Your order is on its way!</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-mono font-semibold text-gray-900 text-lg">{order.tracking_number}</p>
                  </div>

                  {order.carrier && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Carrier</p>
                      <p className="font-semibold text-gray-900">{order.carrier}</p>
                    </div>
                  )}

                  {order.shipping_status && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shipping Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.shipping_status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.shipping_status === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-700'
                          : order.shipping_status === 'in_transit'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.shipping_status === 'shipped'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.shipping_status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  )}

                  {order.shipped_at && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shipped Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.shipped_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {order.estimated_delivery && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                      <p className="font-semibold text-primary">
                        {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {order.delivered_at && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivered Date</p>
                      <p className="font-semibold text-green-700">
                        {new Date(order.delivered_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div className="text-gray-600">
                <p className="mb-2">
                  <span className="font-semibold text-gray-900">Method:</span>{' '}
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'stripe' ? 'Stripe' : order.payment_method === 'payhere' ? 'PayHere' : order.payment_method || 'PayPal'}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-900">Status:</span>{' '}
                  <span
                    className={`${
                      order.payment_status === 'paid' ? 'text-success' : 'text-accent'
                    } font-semibold`}
                  >
                    {formatStatus(order.payment_status)}
                  </span>
                </p>
                {order.paypal_order_id && (
                  <p className="text-xs text-gray-500 mt-2">
                    PayPal Order ID: {order.paypal_order_id}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/contact"
                className="block text-center px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Contact Support
              </Link>
              {order.order_status === 'completed' && (
                <Link
                  href="/products"
                  className="block text-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
                >
                  Buy Again
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
