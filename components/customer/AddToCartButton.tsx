'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import AddToWishlistButton from './AddToWishlistButton';

interface AddToCartButtonProps {
  product: any;
  availableSizes?: string[];
  className?: string;
  showWishlist?: boolean;
  productId?: number;
}

export default function AddToCartButton({ product, availableSizes = [], className = '', showWishlist = false, productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // If product has sizes, require size selection
    if (availableSizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      product_id: product.product_id,
      product_name: product.product_name,
      price: Number(product.price),
      discount_price: product.discount_price ? Number(product.discount_price) : undefined,
      quantity,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      selected_size: selectedSize || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <div>
          <span className="font-semibold text-gray-700 mb-2 block">Size:</span>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold transition ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100 rounded-l-lg"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
            className="p-2 hover:bg-gray-100 rounded-r-lg"
            disabled={quantity >= product.stock_quantity}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-stretch gap-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || added}
          className="flex-1 bg-gradient-to-r from-primary to-accent text-white h-[42px] px-6 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>

        {/* Wishlist Button */}
        {showWishlist && productId && (
          <div className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200">
            <AddToWishlistButton productId={productId} />
          </div>
        )}
      </div>
    </div>
  );
}
