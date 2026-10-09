import { create } from 'zustand';
import { CartItem, Member, Product } from './types';

interface AppState {
  cart: CartItem[];
  cartOpen: boolean;
  member: Member | null;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  searchQuery: string;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setMember: (member: Member | null) => void;
  setSearchQuery: (query: string) => void;
  reorderItems: (items: { product: Product; quantity: number }[]) => void;
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  cartOpen: false,
  member: null,
  toasts: [],
  searchQuery: '',
  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.ID === item.ID);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.ID === item.ID ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (cartItemId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.cartItemId !== cartItemId),
    })),
  updateQuantity: (cartItemId, delta) =>
    set((state) => ({
      cart: state.cart.map((i) => {
        if (i.cartItemId === cartItemId) {
          const newQ = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQ };
        }
        return i;
      }),
    })),
  clearCart: () => set({ cart: [] }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setMember: (member) => {
    if (member) localStorage.setItem('cq_member', JSON.stringify(member));
    else localStorage.removeItem('cq_member');
    set({ member });
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  reorderItems: (items) =>
    set((state) => {
      const newCart = [...state.cart];
      items.forEach((item) => {
        const existing = newCart.find((i) => i.ID === item.product.ID);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          newCart.push({
            ...item.product,
            cartItemId: `${item.product.ID}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            quantity: item.quantity,
          });
        }
      });
      return { cart: newCart };
    }),
}));
