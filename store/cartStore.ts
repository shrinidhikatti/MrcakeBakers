import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variantSelections?: Record<string, { variantId: string; name: string; priceModifier: number }>
  customText?: string
  customImage?: string
  isCustomCake?: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Generate a unique key based on product + variants + customization
          const variantKey = item.variantSelections
            ? JSON.stringify(item.variantSelections)
            : '';
          const customKey = `${item.customText || ''}|${item.customImage || ''}`;
          const itemKey = `${item.id}:${variantKey}:${customKey}`;

          const existingItem = state.items.find((i) => {
            const existingVariantKey = i.variantSelections
              ? JSON.stringify(i.variantSelections)
              : '';
            const existingCustomKey = `${i.customText || ''}|${i.customImage || ''}`;
            return `${i.id}:${existingVariantKey}:${existingCustomKey}` === itemKey;
          })

          if (existingItem) {
            return {
              items: state.items.map((i) => {
                const iVariantKey = i.variantSelections
                  ? JSON.stringify(i.variantSelections)
                  : '';
                const iCustomKey = `${i.customText || ''}|${i.customImage || ''}`;
                const iKey = `${i.id}:${iVariantKey}:${iCustomKey}`;
                return iKey === itemKey
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i;
              }),
            }
          }

          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
