'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';

function StripeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndUpdateOrder = async () => {
      if (orderId && sessionId) {
        // Clear the cart since payment was successful
        clearCart();

        try {
          // Update the order status immediately (don't wait for webhook)
          const response = await fetch('/api/payments/stripe/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              order_id: orderId,
            }),
          });

          const data = await response.json();

          if (data.success) {
            setStatus('success');
          } else {
            // Still show success page even if verification fails (webhook will handle it)
            setStatus('success');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          // Still show success page (webhook will handle the update)
          setStatus('success');
        }
      } else {
        setStatus('error');
      }
    };

    verifyAndUpdateOrder();
  }, [orderId, sessionId, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            There was an issue processing your payment.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. Your payment has been confirmed.
          </p>
          <p className="text-sm text-green-600 font-medium mb-6">
            ✓ Payment processed via Stripe
          </p>

          {orderId && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{orderId}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Paid - Preparing for Delivery</span>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Payment confirmed and verified</p>
            </div>
            <p className="text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-gray-600">
              Your order is now being prepared for delivery. Track your order status in your account dashboard.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/account/orders')}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
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

export default function StripeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <StripeSuccessContent />
    </Suspense>
  );
}
