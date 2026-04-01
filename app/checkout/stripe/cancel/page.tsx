'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function StripeCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            You have cancelled the payment process. Your order has not been placed.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/checkout')}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
            >
              Return to Checkout
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
