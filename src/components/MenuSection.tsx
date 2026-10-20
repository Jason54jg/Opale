"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BUSINESS,
  CATEGORIES,
  MENU_ITEMS,
  TACOS_SIZES,
  formatPrice,
  type MenuCategoryId,
  type MenuItem,
  type TacosSizeId,
} from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import { CartPanel } from "./CartPanel";
import {
  ItemCustomizeModal,
  type CustomizeTarget,
} from "./ItemCustomizeModal";
import { HomemadeBadge } from "./HomemadeBadge";

export function MenuSection() {
  const { t, locale } = useI18n();
  const { count } = useCart();
  const [category, setCategory] = useState<MenuCategoryId>("kebabs");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<CustomizeTarget | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (category === "tacos") return [];
    return MENU_ITEMS.filter((item) => {
      if (item.category !== category) return false;
      if (category === "sauces") return true;
      if (!q) return true;
      const name = t(item.nameKey).toLowerCase();
      const note = item.noteKey ? t(item.noteKey).toLowerCase() : "";
      return name.includes(q) || note.includes(q);
    });
  }, [category, query, t]);

  function openItem(item: MenuItem) {
    if (item.category === "sauces") return;
    setTarget({ type: "item", item });
  }

  function openTacos(sizeId: TacosSizeId) {
    setTarget({ type: "tacos", sizeId });
  }

  return (
    <section id="menu" className="section-pad scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="section-title">{t("menu.title")}</h2>
            <p className="section-sub">{t("menu.subtitle")}</p>
          </div>
          {count > 0 && (
            <a
              href="#ma-liste"
              className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {t("menu.listLink", { count })}
            </a>
          )}
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-col gap-4">
              <div className="relative max-w-md">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--fg-muted)]"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("menu.search")}
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pr-4 pl-10 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label={t("menu.title")}
              >
                {CATEGORIES.map((id) => {
                  const active = category === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(id)}
                      className={
                        active
                          ? "inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold leading-none whitespace-nowrap text-[var(--bg)]"
                          : "inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-transparent px-4 text-sm font-semibold leading-none whitespace-nowrap text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                      }
                    >
                      {t(`menu.categories.${id}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {category === "kebabs" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.sandwichMenu")}
              </p>
            )}
            {category === "plates" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.platesNote")}
              </p>
            )}
            {category === "salads" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.saladsNote")}
              </p>
            )}
            {category === "desserts" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.dessertsNote")}
              </p>
            )}
            {category === "sauces" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.saucesNote")}
              </p>
            )}
            {category === "sides" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.sidesNote")}
              </p>
            )}
            {category === "tacos" && (
              <p className="mt-6 text-sm text-[var(--fg-muted)]">
                {t("menu.tacosNote")}
              </p>
            )}

            <AnimatePresence mode="wait">
              {category === "tacos" ? (
                <motion.ul
                  key="tacos"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]"
                >
                  {TACOS_SIZES.map((size) => (
                    <li key={size.id}>
                      <button
                        type="button"
                        onClick={() => openTacos(size.id)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-[var(--accent-soft)]"
                      >
                        <div>
                          <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--fg)]">
                            Tacos {size.id}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--fg-muted)]">
                            {t("tacos.meatsCount", { n: size.meats })} ·{" "}
                            {t("menu.tapToCompose")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--accent)]">
                            {formatPrice(size.price, locale)}
                          </span>
                          <span className="rounded-full border border-[var(--border)] p-2 text-[var(--accent)]">
                            <Plus className="size-4" />
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ul
                  key={`${category}-${query}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]"
                >
                  {items.length === 0 && (
                    <li className="py-8 text-center text-[var(--fg-muted)]">
                      {t("menu.empty")}
                    </li>
                  )}
                  {items.map((item) => {
                    const clickable = item.category !== "sauces";
                    const content = (
                      <>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-[var(--fg)]">
                              {t(item.nameKey)}
                            </h3>
                            {item.homemade && <HomemadeBadge />}
                          </div>
                          {item.noteKey && (
                            <p className="mt-1 text-sm text-[var(--fg-muted)]">
                              {t(item.noteKey)}
                            </p>
                          )}
                          {clickable && (
                            <p className="mt-1 text-xs text-[var(--accent)]">
                              {t("menu.tapToCompose")}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <div className="text-right font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--accent)]">
                            {item.price != null ? (
                              <>
                                {formatPrice(item.price, locale)}
                                {item.priceAlt != null && (
                                  <span className="text-[var(--fg-muted)]">
                                    {" "}
                                    / {formatPrice(item.priceAlt, locale)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="font-sans text-sm font-normal text-[var(--fg-muted)]">
                                {t("menu.askPrice")}
                              </span>
                            )}
                          </div>
                          {clickable && (
                            <span className="rounded-full border border-[var(--border)] p-2 text-[var(--accent)]">
                              <Plus className="size-4" />
                            </span>
                          )}
                        </div>
                      </>
                    );
                    return (
                      <li key={item.id}>
                        {clickable ? (
                          <button
                            type="button"
                            onClick={() => openItem(item)}
                            className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:bg-[var(--accent-soft)]"
                          >
                            {content}
                          </button>
                        ) : (
                          <div className="flex w-full items-start justify-between gap-4 py-4">
                            {content}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>

            <p className="mt-6 text-xs text-[var(--fg-muted)]">
              {locale === "fr"
                ? `Menu sandwich +${formatPrice(BUSINESS.sandwichMenuExtra, locale)} (boisson 33cl et/ou petites frites).`
                : `Sandwich menu +${formatPrice(BUSINESS.sandwichMenuExtra, locale)} (33cl drink and/or small fries).`}
            </p>
          </div>

          <div id="ma-liste">
            <CartPanel />
          </div>
        </div>
      </div>

      <ItemCustomizeModal target={target} onClose={() => setTarget(null)} />
    </section>
  );
}
