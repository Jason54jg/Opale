export type StoredLocale = "fr" | "en";
const KEY = "opale-locale";
let current: StoredLocale = "fr";
let hydrated = false;
const listeners = new Set<() => void>();
export function getServerLocaleSnapshot(): StoredLocale { return "fr"; }
export function getLocaleSnapshot(): StoredLocale {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    try { if (window.localStorage.getItem(KEY) === "en") current = "en"; } catch { /* mémoire */ }
  }
  return current;
}
export function setStoredLocale(locale: StoredLocale) {
  hydrated = true;
  current = locale;
  try { window.localStorage.setItem(KEY, locale); } catch { /* conserver le choix en mémoire */ }
  listeners.forEach((listener) => listener());
}
export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY && event.key !== null) return;
    hydrated = true;
    current = event.newValue === "en" ? "en" : "fr";
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
