'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, User, MapPin, CreditCard, Save, Truck, CheckCircle } from 'lucide-react';
import { formatStatus } from '@/lib/utils/format-status';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: {
    product_name: string;
    image_url: string | null;
  };
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  shipping_address: string | null;
  tracking_number: string | null;
  carrier: string | null;
  shipping_status: string | null;
  shipped_at: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
  order_items: OrderItem[];
}

interface Carrier {
  id: string;
  name: string;
  isActive: boolean;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [shippingStatus, setShippingStatus] = useState('');
  const [updatingShipping, setUpdatingShipping] = useState(false);

  useEffect(() => {
    fetchOrder();
    fetchCarriers();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        setOrderStatus(data.order.order_status);
        setPaymentStatus(data.order.payment_status);
        setShippingStatus(data.order.shipping_status || 'pending');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/shipping`);
      const data = await response.json();

      if (data.success && data.carriers) {
        setCarriers(data.carriers);
        const activeCarrier = data.carriers.find((c: Carrier) => c.isActive);
        if (activeCarrier) {
          setSelectedCarrier(activeCarrier.id);
        }
      }
    } catch (error) {
      console.error('Error fetching carriers:', error);
    }
  };

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: orderStatus,
          payment_status: paymentStatus,
        }),
      });

      if (response.ok) {
        alert('Order status updated successfully');
        fetchOrder();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedCarrier) {
      alert('Please select a carrier');
      return;
    }

    setCreatingShipment(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrier: selectedCarrier }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Shipment created successfully');
        fetchOrder();
      } else {
        alert(data.error || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Error creating shipment');
    } finally {
      setCreatingShipment(false);
    }
  };

  const handleUpdateShipping = async () => {
    setUpdatingShipping(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/shipping`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_status: shippingStatus,
          delivered_at: shippingStatus === 'delivered' ? new Date().toISOString() : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Shipping status updated successfully');
        fetchOrder();
      } else {
        alert(data.error || 'Failed to update shipping status');
      }
    } catch (error) {
      console.error('Error updating shipping status:', error);
      alert('Error updating shipping status');
    } finally {
      setUpdatingShipping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link href="/admin/orders" className="text-primary hover:text-primary-light">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product.product_name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Rs {Number(item.price).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm text-gray-600">
                      Rs {(Number(item.price) * item.quantity).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {Number(order.subtotal).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Rs {Number(order.tax).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Rs {Number(order.shipping).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>Rs {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">
                  {order.user.first_name} {order.user.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{order.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <p className="text-gray-900">{order.shipping_address}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="pending">Payment Pending</option>
                  <option value="processing">Paid - Preparing for Delivery</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="pending">Payment Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Payment Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={saving}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-semibold text-gray-900">
                  {order.payment_method === 'cod'
                    ? 'Cash on Delivery'
                    : order.payment_method === 'paypal'
                    ? 'PayPal'
                    : order.payment_method || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-orange-700'
                  }`}
                >
                  {formatStatus(order.payment_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping & Tracking
            </h2>

            {!order.tracking_number ? (
              /* Create Shipment Form */
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Create a shipment to generate tracking information</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Carrier
                  </label>
                  <select
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {carriers.filter(c => c.isActive).map((carrier) => (
                      <option key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCreateShipment}
                  disabled={creatingShipment}
                  className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Truck className="w-5 h-5" />
                  {creatingShipment ? 'Creating...' : 'Create Shipment'}
                </button>
              </div>
            ) : (
              /* Tracking Information Display */
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-1">Shipment Created</p>
                      <p className="text-xs text-green-700">Tracking number has been generated</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-mono font-semibold text-gray-900">{order.tracking_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="font-semibold text-gray-900">{order.carrier}</p>
                  </div>
                  {order.shipped_at && (
                    <div>
                      <p className="text-sm text-gray-600">Shipped At</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.shipped_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                  {order.estimated_delivery && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold text-gray-900">
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
                      <p className="text-sm text-gray-600">Delivered At</p>
                      <p className="font-semibold text-green-700">
                        {new Date(order.delivered_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shipping Status
                  </label>
                  <select
                    value={shippingStatus}
                    onChange={(e) => setShippingStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent mb-3"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button
                    onClick={handleUpdateShipping}
                    disabled={updatingShipping}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {updatingShipping ? 'Updating...' : 'Update Shipping Status'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
