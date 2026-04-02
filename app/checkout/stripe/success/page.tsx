'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader } from 'lucide-react';

function StripeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (orderId && sessionId) {
      // Give the webhook a moment to process
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    } else {
      setStatus('error');
    }
  }, [orderId, sessionId]);

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
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {orderId && (
            <div className="bg-surface border border-primary rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-bold text-gray-900">{orderId}</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <p className="text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-gray-600">
              You can track your order status in your account dashboard.
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
