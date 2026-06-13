import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, ProductType } from "@/types"
import { getCurrencySymbol } from "@/lib/utils"

interface CartState {
  cart: CartItem[]
  setCart: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCartItemProperty: (id: string, key: "colors" | "sizes", value: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  cartCount: () => number
  cartTotalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      setCart: (item) => {
        const existing = get().cart
        const idx = existing.findIndex((i) => i.id === item.id)
        if (idx !== -1) {
          const updated = [...existing]
          updated[idx].quantity += item.quantity
          set({ cart: updated })
        } else {
          set({ cart: [...existing, item] })
        }
      },
      updateQuantity: (id, quantity) =>
        set({ cart: get().cart.map((i) => (i.id === id ? { ...i, quantity } : i)) }),
      updateCartItemProperty: (id, key, value) =>
        set({
          cart: get().cart.map((item) => {
            if (item.id !== id) return item
            const current = Array.isArray(item[key]) ? (item[key] as string[]) : []
            const updated = current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value]
            return { ...item, [key]: updated }
          }),
        }),
      increaseQuantity: (id) =>
        set({ cart: get().cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)) }),
      decreaseQuantity: (id) =>
        set({
          cart: get()
            .cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        }),
      removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
      clearCart: () => set({ cart: [] }),
      isInCart: (id) => get().cart.some((i) => i.id === id),
      cartCount: () => get().cart.reduce((acc, i) => acc + i.quantity, 0),
      cartTotalPrice: () => get().cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "forge-cart" }
  )
)
