import type { CartItem, NewCartItem } from "./CartContext";
const KEY = "opale-cart";
const EMPTY: CartItem[] = [];
let items: CartItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((v) => typeof v === "string");
function parse(raw: string | null): CartItem[] {
  try {
    const value: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is CartItem => {
      if (!entry || typeof entry !== "object") return false;
      if (typeof entry.id !== "string" || !Number.isFinite(entry.price) || entry.price < 0) return false;
      if (!strings(entry.sauces) || !strings(entry.extras)) return false;
      if (entry.kind === "tacos") return ["M", "L", "XL", "XXL"].includes(entry.sizeId) && strings(entry.meats);
      return entry.kind === "menu" && typeof entry.itemId === "string" && typeof entry.nameKey === "string" && typeof entry.withMenu === "boolean";
    });
  } catch { return []; }
}
export function getServerCartSnapshot() { return EMPTY; }
export function getCartSnapshot() {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    try { items = parse(window.localStorage.getItem(KEY)); } catch { /* mémoire */ }
  }
  return items;
}
function update(next: CartItem[]) {
  hydrated = true;
  items = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* panier conservé en mémoire */ }
  listeners.forEach((listener) => listener());
}
export function addCartItem(item: NewCartItem) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  update([...getCartSnapshot(), { ...item, id } as CartItem]);
}
export function removeCartItem(id: string) { update(getCartSnapshot().filter((item) => item.id !== id)); }
export function clearCart() { update([]); }
export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY && event.key !== null) return;
    hydrated = true;
    items = parse(event.newValue);
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
