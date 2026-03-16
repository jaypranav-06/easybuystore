'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, CheckCircle } from 'lucide-react';
import ReviewOrderModal from './ReviewOrderModal';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    product_name: string;
    image_url: string | null;
  } | null;
}

interface OrderItemWithReviewProps {
  item: OrderItem;
  orderId: number;
  orderStatus: string;
  hasReviewed: boolean;
}

export default function OrderItemWithReview({
  item,
  orderId,
  orderStatus,
  hasReviewed,
}: OrderItemWithReviewProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewed, setReviewed] = useState(hasReviewed);

  const canReview = orderStatus === 'completed' && !reviewed;

  const handleReviewSuccess = () => {
    setReviewed(true);
  };

  return (
    <>
      <div className="flex gap-4 items-start">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {item.product?.image_url ? (
            <Image
              src={item.product.image_url}
              alt={item.product.product_name || 'Product'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.product_id}`}
            className="font-semibold text-gray-900 hover:text-primary block truncate"
          >
            {item.product?.product_name || 'Product'}
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            Quantity: {item.quantity} × Rs{' '}
            {Number(item.price).toLocaleString('en-LK', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {/* Review Status/Button */}
          <div className="mt-2">
            {reviewed ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Review submitted</span>
              </div>
            ) : canReview ? (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-2 text-primary hover:text-primary-light font-medium text-sm transition"
              >
                <Star className="w-4 h-4" />
                Write a Review
              </button>
            ) : orderStatus === 'completed' ? (
              <div className="text-sm text-gray-500">Review pending approval</div>
            ) : null}
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-gray-900">
            Rs{' '}
            {Number(item.subtotal).toLocaleString('en-LK', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Review Modal */}
      {item.product && (
        <ReviewOrderModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={item.product_id}
          productName={item.product.product_name}
          productImage={item.product.image_url}
          orderId={orderId}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  );
}
