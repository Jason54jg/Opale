"use client";

import { Trash2 } from "lucide-react";
import {
  TACOS_EXTRAS,
  TACOS_MEATS,
  TACOS_SAUCES,
  formatPrice,
} from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";

function labels(
  ids: string[],
  catalog: readonly { id: string; nameKey: string }[],
  t: (k: string) => string,
) {
  if (!ids.length) return "";
  return ids
    .map((id) => {
      const found = catalog.find((c) => c.id === id);
      return found ? t(found.nameKey) : id;
    })
    .join(", ");
}

export function CartPanel({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const { items, total, removeItem, clear } = useCart();

  // Numérotation propre aux tacos (indépendante des autres articles)
  const tacosNumbers = new Map<string, number>();
  for (const item of items) {
    if (item.kind === "tacos") tacosNumbers.set(item.id, tacosNumbers.size + 1);
  }

  return (
    <aside
      className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 ${
        compact ? "" : "lg:sticky lg:top-24"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--fg)]">
          {t("composer.listTitle")}
        </h3>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            {t("composer.clearList")}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--fg-muted)]">
          {t("menu.cartHint")}
        </p>
      ) : (
        <ul className="mt-4 max-h-80 divide-y divide-[var(--border)] overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3 first:pt-0">
              <div className="min-w-0 flex-1">
                {item.kind === "tacos" ? (
                  <>
                    <p className="font-medium text-[var(--fg)]">
                      {t("composer.tacosItem", {
                        n: tacosNumbers.get(item.id) ?? 0,
                        size: item.sizeId,
                      })}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
                      {[
                        labels(item.meats, TACOS_MEATS, t),
                        labels(item.sauces, TACOS_SAUCES, t),
                        labels(item.extras, TACOS_EXTRAS, t),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-[var(--fg)]">
                      {t(item.nameKey)}
                      {item.withMenu ? ` · ${t("composer.withMenu")}` : ""}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
                      {[
                        labels(item.sauces, TACOS_SAUCES, t),
                        labels(item.extras, TACOS_EXTRAS, t),
                      ]
                        .filter(Boolean)
                        .join(" · ") || t("composer.noOptions")}
                    </p>
                  </>
                )}
                <p className="mt-1 text-sm text-[var(--accent)]">
                  {formatPrice(item.price, locale)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="self-start rounded-full border border-[var(--border)] p-2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                aria-label={t("composer.remove")}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-3 flex items-end justify-between border-t border-[var(--border)] pt-3">
          <span className="text-sm text-[var(--fg-muted)]">
            {t("composer.listTotal")}
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--accent)]">
            {formatPrice(total, locale)}
          </span>
        </div>
      )}
    </aside>
  );
}
