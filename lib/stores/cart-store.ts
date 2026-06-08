import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

type CartState = {
  // Cart is scoped to a single supplier at a time.
  supplierId: string | null;
  items: Record<string, CartItem>;
  setSupplier: (id: string) => void;
  add: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (item: Omit<CartItem, "quantity">) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  supplierId: null,
  items: {},
  setSupplier: (id) =>
    set((state) =>
      state.supplierId === id
        ? state
        : { supplierId: id, items: {} },
    ),
  add: (item) =>
    set((state) => ({
      items: {
        ...state.items,
        [item.productId]: state.items[item.productId]
          ? {
              ...state.items[item.productId],
              quantity: state.items[item.productId].quantity + 1,
            }
          : { ...item, quantity: 1 },
      },
    })),
  increment: (item) =>
    set((state) => ({
      items: {
        ...state.items,
        [item.productId]: state.items[item.productId]
          ? {
              ...state.items[item.productId],
              quantity: state.items[item.productId].quantity + 1,
            }
          : { ...item, quantity: 1 },
      },
    })),
  decrement: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;
      const nextQty = existing.quantity - 1;
      const items = { ...state.items };
      if (nextQty <= 0) {
        delete items[productId];
      } else {
        items[productId] = { ...existing, quantity: nextQty };
      }
      return { items };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;
      const items = { ...state.items };
      if (quantity <= 0) {
        delete items[productId];
      } else {
        items[productId] = { ...existing, quantity };
      }
      return { items };
    }),
  remove: (productId) =>
    set((state) => {
      const items = { ...state.items };
      delete items[productId];
      return { items };
    }),
  clear: () => set({ items: {} }),
}));
