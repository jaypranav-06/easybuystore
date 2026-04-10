import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

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

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discount_price || item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'easybuystore-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
