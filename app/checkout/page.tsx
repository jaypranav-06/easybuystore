'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import Image from 'next/image';
import { ShoppingBag, CreditCard, Truck, Lock, CheckCircle } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cod'>('cod'); // Default to COD

  // Check if PayPal is configured
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isPayPalConfigured = paypalClientId && paypalClientId !== 'your-paypal-client-id' && paypalClientId.length > 10;

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?redirect=/checkout');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step < 3) {
      router.push('/cart');
    }
  }, [items, step, router]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!shippingData.firstName || !shippingData.lastName || !shippingData.email ||
        !shippingData.phone || !shippingData.address || !shippingData.city ||
        !shippingData.state || !shippingData.zipCode) {
      setError('Please fill in all required fields');
      return;
    }

    setStep(2);
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'USD',
          items: items.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            unit_amount: item.discount_price || item.price,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.paypal_order_id;
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to create PayPal order');
      throw err;
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.discount_price || item.price,
          })),
          total: total,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          shipping_name: `${shippingData.firstName} ${shippingData.lastName}`,
          shipping_address: shippingData.address,
          shipping_city: shippingData.city,
          shipping_state: shippingData.state,
          shipping_zip: shippingData.zipCode,
          shipping_country: shippingData.country || 'Sri Lanka',
          shipping_phone: shippingData.phone,
          payment_method: 'cod',
          payment_status: 'pending',
        }),
      });

      const orderData = await orderResponse.json();
      if (orderData.success) {
        setOrderId(orderData.order.order_number);
        clearCart();
        setStep(3);
      } else {
        setError(orderData.error || 'Failed to create order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    setLoading(true);
    try {
      // First create the order in our database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.discount_price || item.price,
          })),
          total: total,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          shipping_name: `${shippingData.firstName} ${shippingData.lastName}`,
          shipping_address: shippingData.address,
          shipping_city: shippingData.city,
          shipping_state: shippingData.state,
          shipping_zip: shippingData.zipCode,
          shipping_country: shippingData.country || 'Sri Lanka',
          shipping_phone: shippingData.phone,
          payment_method: 'paypal',
          payment_status: 'pending',
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        setError('Failed to create order');
        return;
      }

      // Then capture the PayPal payment
      const captureResponse = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypal_order_id: data.orderID,
          internal_order_id: orderData.order.order_id,
        }),
      });

      const captureResult = await captureResponse.json();
      if (captureResult.success) {
        setOrderId(orderData.order.order_number);
        clearCart();
        setStep(3);
      } else {
        setError(captureResult.error || 'Payment capture failed');
      }
    } catch (err) {
      setError('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Order Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            {orderId && (
              <div className="bg-surface border border-primary rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{orderId}</p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-600">
                A confirmation email has been sent to <strong>{shippingData.email}</strong>
              </p>
              <p className="text-gray-600">
                You can track your order status in your account dashboard.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => router.push('/account/orders')}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push('/products')}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-surface' : 'border-gray-300'}`}>
                <Truck className="w-5 h-5" />
              </div>
              <span className="ml-2 font-semibold">Shipping</span>
            </div>
            <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-surface' : 'border-gray-300'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="ml-2 font-semibold">Payment</span>
            </div>
            <div className={`w-24 h-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-surface' : 'border-gray-300'}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="ml-2 font-semibold">Confirmation</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+94 77 123 4567"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-primary-light text-sm font-semibold"
                  >
                    ← Edit Shipping Information
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-gray-600 text-sm">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                    {shippingData.phone}<br />
                    {shippingData.email}
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    {/* Cash on Delivery Option */}
                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'cod' ? 'border-primary bg-surface' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                        className="w-5 h-5 text-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-gray-900">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay with cash when your order is delivered</p>
                      </div>
                    </label>

                    {/* PayPal Option (if configured) */}
                    {isPayPalConfigured && (
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'paypal' ? 'border-primary bg-surface' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-gray-900">PayPal</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Pay securely with PayPal</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Show payment buttons based on selected method */}
                {paymentMethod === 'cod' ? (
                  <button
                    onClick={handleCODOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Place Order (Cash on Delivery)
                      </>
                    )}
                  </button>
                ) : isPayPalConfigured ? (
                  <>
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                      <Lock className="w-5 h-5" />
                      <span className="text-sm">Secure payment powered by PayPal</span>
                    </div>

                    <PayPalScriptProvider
                      options={{
                        clientId: paypalClientId || '',
                        currency: 'USD',
                      }}
                    >
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                          setError('PayPal payment failed. Please try again.');
                          console.error('PayPal error:', err);
                        }}
                        disabled={loading}
                        style={{
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'rect',
                          label: 'paypal',
                        }}
                      />
                    </PayPalScriptProvider>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded bg-gray-100">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.product_name} fill className="object-cover rounded" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900">
                        Rs {((item.discount_price || item.price) * item.quantity).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$Rs {shipping.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>Rs {tax.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs {total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
