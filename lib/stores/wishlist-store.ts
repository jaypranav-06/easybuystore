/**
 * WISHLIST STATE MANAGEMENT STORE
 *
 * This file manages the wishlist state for the entire application using Zustand.
 * It tracks how many items are in the user's wishlist and provides methods to update the count.
 *
 * Key Concepts:
 * - Zustand: A lightweight state management library (simpler alternative to Redux)
 * - Persist middleware: Automatically saves wishlist count to localStorage
 * - Global state: Any component can access and update the wishlist count
 * - Real-time sync: Fetches actual count from database API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * WISHLIST STORE INTERFACE
 *
 * Defines the structure of the wishlist store.
 *
 * Properties:
 * - count: Number of items currently in wishlist
 *
 * Methods:
 * - setCount: Manually set the wishlist count
 * - increment: Add 1 to the count
 * - decrement: Subtract 1 from the count (minimum 0)
 * - fetchCount: Fetch the actual count from the database API
 */
interface WishlistStore {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  fetchCount: () => Promise<void>;
}

/**
 * WISHLIST STORE INSTANCE
 *
 * Creates a global store for managing wishlist count.
 *
 * Features:
 * - Persisted to localStorage under 'wishlist-storage' key
 * - Survives page refreshes
 * - Accessible from any component via useWishlistStore() hook
 *
 * Usage Example:
 * ```
 * const { count, increment, fetchCount } = useWishlistStore();
 * ```
 */
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      // Default state: 0 items in wishlist
      count: 0,

      /**
       * SET COUNT
       *
       * Manually set the wishlist count to a specific number.
       *
       * @param count - The new wishlist count
       */
      setCount: (count) => set({ count }),

      /**
       * INCREMENT
       *
       * Increase the wishlist count by 1.
       * Called when user adds an item to wishlist.
       */
      increment: () => set((state) => ({ count: state.count + 1 })),

      /**
       * DECREMENT
       *
       * Decrease the wishlist count by 1.
       * Called when user removes an item from wishlist.
       * Uses Math.max to ensure count never goes below 0.
       */
      decrement: () => set((state) => ({ count: Math.max(0, state.count - 1) })),

      /**
       * FETCH COUNT
       *
       * Fetches the actual wishlist count from the database via API.
       * This ensures the count is synced with the server.
       *
       * Process:
       * 1. Call GET /api/wishlist to get user's wishlist items
       * 2. Extract the count from the response
       * 3. Update the store with the real count
       *
       * Error Handling:
       * - Silently fails if API call fails
       * - Logs error to console for debugging
       */
      fetchCount: async () => {
        try {
          const response = await fetch('/api/wishlist');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Update count based on actual number of items from API
              set({ count: data.items?.length || 0 });
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist count:', error);
        }
      },
    }),
    {
      // Persist state to localStorage with this key
      name: 'wishlist-storage',
    }
  )
);
