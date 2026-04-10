'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Star } from 'lucide-react';
import AddToCartButton from '@/components/customer/AddToCartButton';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    product_id: number;
    product_name: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    image_url: string | null;
    stock_quantity: number;
    is_active: boolean;
    category: {
      category_name: string;
    } | null;
    avgRating: number;
    reviewCount: number;
  } | null;
  created_at: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const setWishlistCount = useWishlistStore((state) => state.setCount);
  const decrementWishlist = useWishlistStore((state) => state.decrement);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/wishlist');
      return;
    }

    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.items);
        // Update global wishlist count
        setWishlistCount(data.items.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
        // Update global wishlist count
        decrementWishlist();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 fill-current" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-gray-100">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist and shop them later!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              if (!item.product) return null;

              const product = item.product;
              const price = product.discount_price || product.price;
              const originalPrice = product.discount_price ? product.price : null;
              const discount = originalPrice
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="group h-full"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full relative">
                    {/* Remove Button - Top Right */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-white transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Product Image */}
                    <Link href={`/products/${product.product_id}`} className="block relative">
                      <div className="relative aspect-square bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.product_name}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                            -{discount}%
                          </span>
                        )}
                        {product.stock_quantity === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      {product.category && (
                        <p className="text-xs text-gray-500 mb-1.5 truncate uppercase tracking-wide">
                          {product.category.category_name}
                        </p>
                      )}
                      <Link href={`/products/${product.product_id}`}>
                        <h3
                          className="font-semibold text-gray-900 mb-2 min-h-[2.5rem] hover:text-accent transition leading-tight"
                          title={product.product_name}
                        >
                          <span className="line-clamp-2">{product.product_name}</span>
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3 min-h-[1.25rem]">
                        {product.reviewCount > 0 && (
                          <>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3.5 h-3.5"
                                  fill={i < Math.round(product.avgRating) ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviewCount})
                            </span>
                          </>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-4 mt-auto">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl font-bold text-gray-900">
                            Rs {price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </span>
                          {originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              Rs {originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      {product.stock_quantity > 0 ? (
                        <AddToCartButton
                          product={{
                            ...product,
                            reviews: [],
                          }}
                          className="w-full text-sm py-2.5 font-medium"
                        />
                      ) : (
                        <button
                          disabled
                          className="w-full text-sm py-2.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
