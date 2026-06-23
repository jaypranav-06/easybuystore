/**
 * SHOPPING CART STATE MANAGEMENT STORE
 *
 * This file manages the shopping cart state for the entire application using Zustand.
 * It handles adding/removing items, updating quantities, and calculating totals.
 *
 * Key Concepts:
 * - Zustand: Lightweight state management library
 * - Persist middleware: Automatically saves cart to localStorage
 * - Size variants: Handles products with different sizes as separate cart items
 * - Price calculation: Automatically uses discount price when available
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * CART ITEM INTERFACE
 *
 * Defines the structure of a single item in the shopping cart.
 *
 * Properties:
 * - product_id: Unique identifier for the product
 * - product_name: Display name of the product
 * - price: Original price per unit
 * - discount_price: Discounted price per unit (if on sale)
 * - quantity: Number of units in cart
 * - image_url: Product image for display in cart
 * - stock_quantity: Available stock (for validation)
 * - selected_size: Size variant (e.g., "M", "L", "XL") if applicable
 */
export interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  discount_price?: number;
  quantity: number;
  image_url?: string;
  stock_quantity: number;
  selected_size?: string;
}

/**
 * CART STORE INTERFACE
 *
 * Defines the structure and methods of the cart store.
 *
 * State:
 * - items: Array of all items currently in cart
 *
 * Methods:
 * - addItem: Add a product to cart (or increase quantity if exists)
 * - removeItem: Remove a product from cart
 * - updateQuantity: Change the quantity of an item
 * - clearCart: Empty the entire cart
 * - getTotalItems: Calculate total number of items
 * - getTotalPrice: Calculate total price of cart
 */
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/**
 * CART STORE INSTANCE
 *
 * Creates a global store for managing shopping cart state.
 *
 * Features:
 * - Persisted to localStorage under 'easybuystore-cart' key
 * - Survives page refreshes and browser sessions
 * - Accessible from any component via useCartStore() hook
 *
 * Usage Example:
 * ```
 * const { items, addItem, getTotalPrice } = useCartStore();
 * ```
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Default state: empty cart
      items: [],

      /**
       * ADD ITEM
       *
       * Adds a product to the cart. If the same product with same size already exists,
       * it increases the quantity instead of creating a duplicate.
       *
       * Important: Same product with different sizes are treated as separate items.
       * Example: "T-Shirt (Size M)" and "T-Shirt (Size L)" are 2 separate cart items.
       *
       * @param item - The cart item to add
       */
      addItem: (item) =>
        set((state) => {
          // Find existing item with same product_id AND size (if applicable)
          const existingItem = state.items.find(
            (i) => i.product_id === item.product_id && i.selected_size === item.selected_size
          );

          if (existingItem) {
            // Update quantity if item with same size exists
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id && i.selected_size === item.selected_size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          // Add new item (or same product with different size)
          return { items: [...state.items, item] };
        }),

      /**
       * REMOVE ITEM
       *
       * Removes a product from the cart completely, regardless of quantity.
       *
       * @param productId - The ID of the product to remove
       */
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        })),

      /**
       * UPDATE QUANTITY
       *
       * Changes the quantity of an existing item in the cart.
       *
       * @param productId - The ID of the product to update
       * @param quantity - The new quantity (should be > 0)
       */
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        })),

      /**
       * CLEAR CART
       *
       * Removes all items from the cart.
       * Called after successful checkout or when user explicitly empties cart.
       */
      clearCart: () => set({ items: [] }),

      /**
       * GET TOTAL ITEMS
       *
       * Calculates the total number of items in cart.
       * Sums up all quantities (not just number of unique products).
       *
       * Example: 2x Shirt + 3x Pants = 5 total items
       *
       * @returns Total quantity of all items
       */
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * GET TOTAL PRICE
       *
       * Calculates the total price of all items in cart.
       *
       * Price Logic:
       * - Uses discount_price if available, otherwise uses regular price
       * - Multiplies price by quantity for each item
       * - Sums all item totals
       *
       * @returns Total price in currency units (e.g., USD cents or LKR)
       */
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Use discounted price if available, otherwise use regular price
          const price = item.discount_price || item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      // Persist configuration
      name: 'easybuystore-cart', // localStorage key
      storage: createJSONStorage(() => localStorage), // Use browser localStorage
    }
  )
);
