import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-langue.mjs";

test("restaure la langue enregistrée avec un rendu serveur français stable", () => {
  const values = new Map([["opale-locale", "en"]]);
  global.window = { localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } };
  const store = loadTypescript("src/i18n/localeStore.ts");
  assert.equal(store.getServerLocaleSnapshot(), "fr");
  assert.equal(store.getLocaleSnapshot(), "en");
  store.setStoredLocale("fr");
  assert.equal(values.get("opale-locale"), "fr");
});
test("conserve le choix en mémoire quand le stockage est bloqué", () => {
  global.window = { localStorage: { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } } };
  const store = loadTypescript("src/i18n/localeStore.ts");
  assert.equal(store.getLocaleSnapshot(), "fr");
  store.setStoredLocale("en");
  assert.equal(store.getLocaleSnapshot(), "en");
});
