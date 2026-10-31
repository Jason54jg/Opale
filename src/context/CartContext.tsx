"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addCartItem, clearCart, getCartSnapshot, getServerCartSnapshot, removeCartItem, subscribeCart } from "./cartStore";
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

export type NewCartItem = Omit<CartTacosItem, "id"> | Omit<CartMenuItem, "id">;

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      total,
      count: items.length,
      addItem: addCartItem,
      removeItem: removeCartItem,
      clear: clearCart,
    }),
    [items, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
