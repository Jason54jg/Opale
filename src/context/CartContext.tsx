"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TacosSizeId } from "@/data/menu";

export type CartTacosItem = {
  kind: "tacos";
  id: string;
  sizeId: TacosSizeId;
  meats: string[];
  sauces: string[];
  extras: string[];
  price: number;
};

export type CartMenuItem = {
  kind: "menu";
  id: string;
  itemId: string;
  nameKey: string;
  sauces: string[];
  extras: string[];
  withMenu: boolean;
  price: number;
};

export type CartItem = CartTacosItem | CartMenuItem;

type NewCartItem = Omit<CartTacosItem, "id"> | Omit<CartMenuItem, "id">;

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: NewCartItem) => {
    setItems((prev) => [...prev, { ...item, id: makeId() } as CartItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      total,
      count: items.length,
      addItem,
      removeItem,
      clear,
    }),
    [items, total, addItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
