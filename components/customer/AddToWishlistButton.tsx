'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface AddToWishlistButtonProps {
  productId: number;
  isInWishlist?: boolean;
  onToggle?: () => void;
  className?: string;
  showText?: boolean;
}

export default function AddToWishlistButton({
  productId,
  isInWishlist = false,
  onToggle,
  className = '',
  showText = false,
}: AddToWishlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);
  const incrementWishlist = useWishlistStore((state) => state.increment);
  const decrementWishlist = useWishlistStore((state) => state.decrement);

  const handleToggle = async () => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (status === 'loading' || loading) return;

    // Optimistic UI update - update immediately for better UX
    const previousState = inWishlist;
    setInWishlist(!inWishlist);

    // Update global count optimistically
    if (!inWishlist) {
      incrementWishlist();
    } else {
      decrementWishlist();
    }

    setLoading(true);

    try {
      if (previousState) {
        // Remove from wishlist - we need to find the item ID first
        const response = await fetch('/api/wishlist');
        const data = await response.json();

        if (data.success) {
          const item = data.items.find((i: any) => i.product_id === productId);
          if (item) {
            const deleteResponse = await fetch(`/api/wishlist/${item.id}`, {
              method: 'DELETE',
            });

            if (!deleteResponse.ok) {
              // Revert on error
              setInWishlist(true);
              incrementWishlist();
              const errorData = await deleteResponse.json();
              alert(errorData.error || 'Failed to remove from wishlist');
            } else {
              if (onToggle) onToggle();
            }
          }
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId }),
        });

        if (response.ok) {
          if (onToggle) onToggle();
        } else {
          const data = await response.json();
          if (response.status === 409) {
            // Already in wishlist - keep the optimistic update
            if (onToggle) onToggle();
          } else {
            // Revert on error
            setInWishlist(false);
            decrementWishlist();
            alert(data.error || 'Failed to add to wishlist');
          }
        }
      }
    } catch (error) {
      // Revert on error
      setInWishlist(previousState);
      if (previousState) {
        incrementWishlist();
      } else {
        decrementWishlist();
      }
      console.error('Error toggling wishlist:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer ${
        inWishlist
          ? 'text-red-500'
          : 'text-gray-500 hover:text-red-500 hover:scale-110'
      } ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-5 h-5 transition-all ${inWishlist ? 'fill-current' : 'group-hover:scale-110'}`}
      />
      {showText && (
        <span className="text-sm font-medium ml-2">
          {inWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
