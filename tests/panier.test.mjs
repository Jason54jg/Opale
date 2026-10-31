import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-panier.mjs";

const item = { kind: "menu", itemId: "kebab", nameKey: "items.kebab", sauces: [], extras: [], withMenu: false, price: 7 };
test("sauvegarde et restaure les articles après rechargement du module", () => {
  const values = new Map();
  global.window = { localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } };
  const store = loadTypescript("src/context/cartStore.ts");
  assert.deepEqual(store.getServerCartSnapshot(), []);
  store.addCartItem(item);
  const restored = loadTypescript("src/context/cartStore.ts");
  assert.equal(restored.getCartSnapshot().length, 1);
  restored.clearCart();
  assert.deepEqual(JSON.parse(values.get("opale-cart")), []);
});
test("les ajouts et suppressions restent utilisables sans stockage", () => {
  global.window = { localStorage: { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } } };
  const store = loadTypescript("src/context/cartStore.ts");
  store.addCartItem(item); store.addCartItem(item);
  const [first, second] = store.getCartSnapshot();
  assert.notEqual(first.id, second.id);
  store.removeCartItem(first.id);
  assert.equal(store.getCartSnapshot()[0].id, second.id);
});
test("ignore une sauvegarde corrompue ou des articles incomplets", () => {
  for (const raw of ["{", '[null,{}, {"price":-2}]']) {
    global.window = { localStorage: { getItem: () => raw, setItem() {} } };
    const store = loadTypescript("src/context/cartStore.ts");
    assert.deepEqual(store.getCartSnapshot(), []);
  }
});
