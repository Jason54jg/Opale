"use client";

import { Check, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BUSINESS,
  COMPOSABLE_ITEM_IDS,
  MENU_ITEMS,
  TACOS_EXTRAS,
  TACOS_MAX_SAUCES,
  TACOS_MEATS,
  TACOS_MIN_SAUCES,
  TACOS_SAUCES,
  TACOS_SIZES,
  computeSandwichPrice,
  computeTacosPrice,
  formatPrice,
  isValidSandwichComposition,
  isValidTacosComposition,
  type MenuItem,
  type TacosSizeId,
} from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import { HomemadeBadge } from "./HomemadeBadge";

export type CustomizeTarget =
  | { type: "tacos"; sizeId: TacosSizeId }
  | { type: "item"; item: MenuItem };

type Props = {
  target: CustomizeTarget | null;
  onClose: () => void;
};

function isFullCompose(itemId: string) {
  return (COMPOSABLE_ITEM_IDS as readonly string[]).includes(itemId);
}

function needsSauces(item: MenuItem) {
  return (
    isFullCompose(item.id) ||
    item.category === "plates" ||
    item.category === "kids" ||
    item.category === "burgers"
  );
}

function needsExtras(item: MenuItem) {
  return isFullCompose(item.id);
}

function needsMenuOption(item: MenuItem) {
  return isFullCompose(item.id);
}

export function ItemCustomizeModal({ target, onClose }: Props) {
  const { t, locale } = useI18n();
  const { addItem } = useCart();

  const [meats, setMeats] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [withMenu, setWithMenu] = useState(false);

  useEffect(() => {
    setMeats([]);
    setSauces([]);
    setExtras([]);
    setWithMenu(false);
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  const tacosSize =
    target?.type === "tacos"
      ? TACOS_SIZES.find((s) => s.id === target.sizeId)!
      : null;

  const menuItem = target?.type === "item" ? target.item : null;

  const title =
    target?.type === "tacos"
      ? `Tacos ${target.sizeId}`
      : menuItem
        ? t(menuItem.nameKey)
        : "";

  const price = useMemo(() => {
    if (!target) return 0;
    if (target.type === "tacos") {
      return computeTacosPrice(target.sizeId, sauces, extras);
    }
    if (needsExtras(target.item) || needsMenuOption(target.item)) {
      return computeSandwichPrice(
        target.item.id,
        sauces,
        extras,
        withMenu,
      );
    }
    let sum = target.item.price ?? 0;
    if (sauces.includes("fromagere")) sum += 1;
    if (withMenu) sum += BUSINESS.sandwichMenuExtra;
    return sum;
  }, [target, sauces, extras, withMenu]);

  const valid = useMemo(() => {
    if (!target) return false;
    if (target.type === "tacos") {
      return isValidTacosComposition(target.sizeId, meats, sauces);
    }
    if (needsSauces(target.item)) {
      return isValidSandwichComposition(sauces);
    }
    return target.item.price != null;
  }, [target, meats, sauces]);

  if (!target) return null;

  function toggleMeat(id: string) {
    if (!tacosSize) return;
    setMeats((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id);
      if (prev.length >= tacosSize.meats) return prev;
      return [...prev, id];
    });
  }

  function toggleSauce(id: string) {
    setSauces((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= TACOS_MAX_SAUCES) return prev;
      return [...prev, id];
    });
  }

  function toggleExtra(id: string) {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  function submit() {
    if (!valid || !target) return;
    if (target.type === "tacos") {
      addItem({
        kind: "tacos",
        sizeId: target.sizeId,
        meats: [...meats],
        sauces: [...sauces],
        extras: [...extras],
        price,
      });
    } else {
      addItem({
        kind: "menu",
        itemId: target.item.id,
        nameKey: target.item.nameKey,
        sauces: [...sauces],
        extras: [...extras],
        withMenu,
        price,
      });
    }
    onClose();
  }

  const showMeats = target.type === "tacos";
  const showSauces =
    target.type === "tacos" || (menuItem != null && needsSauces(menuItem));
  const showExtras =
    target.type === "tacos" || (menuItem != null && needsExtras(menuItem));
  const showMenu =
    menuItem != null && needsMenuOption(menuItem);
  const simpleAdd =
    menuItem != null &&
    !needsSauces(menuItem) &&
    !needsExtras(menuItem);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--fg)]">
              {title}
            </h3>
            {menuItem?.homemade && (
              <div className="mt-2">
                <HomemadeBadge />
              </div>
            )}
            {target.type === "tacos" && (
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {t("tacos.meatsCount", { n: tacosSize!.meats })} ·{" "}
                {formatPrice(tacosSize!.price, locale)}
              </p>
            )}
            {simpleAdd && (
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {t("menu.addDirect")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] p-2 text-[var(--fg-muted)]"
            aria-label={t("menu.close")}
          >
            <X className="size-4" />
          </button>
        </div>

        {showMeats && (
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-medium text-[var(--fg)]">
              {t("tacos.steps.meats")} ({meats.length}/{tacosSize!.meats})
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {TACOS_MEATS.map((m) => {
                const active = meats.includes(m.id);
                const full = !active && meats.length >= tacosSize!.meats;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={full}
                    onClick={() => toggleMeat(m.id)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm disabled:opacity-40 ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {t(m.nameKey)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {showSauces && (
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-medium text-[var(--fg)]">
              {t("tacos.steps.sauces")} ({sauces.length}/{TACOS_MAX_SAUCES}) —{" "}
              {t("composer.saucesRule")}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {TACOS_SAUCES.map((s) => {
                const active = sauces.includes(s.id);
                const full = !active && sauces.length >= TACOS_MAX_SAUCES;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={full}
                    onClick={() => toggleSauce(s.id)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm disabled:opacity-40 ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <span>
                      {t(s.nameKey)}
                      {"extra" in s && s.extra ? (
                        <span className="text-[var(--fg-muted)]"> +1€</span>
                      ) : null}
                    </span>
                    {active && <Check className="size-3.5 text-[var(--accent)]" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {showMenu && (
          <button
            type="button"
            onClick={() => setWithMenu((v) => !v)}
            className={`mb-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
              withMenu
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)]"
            }`}
          >
            <span>
              {menuItem?.id === "crousty"
                ? t("composer.croustyDrink")
                : t("composer.menuOption", {
                    price: formatPrice(BUSINESS.sandwichMenuExtra, locale),
                  })}
            </span>
            {withMenu && <Check className="size-4 text-[var(--accent)]" />}
          </button>
        )}

        {showExtras && (
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-medium text-[var(--fg)]">
              {t("tacos.steps.extras")}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {TACOS_EXTRAS.map((e) => {
                const active = extras.includes(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleExtra(e.id)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <span>
                      {t(e.nameKey)}
                      <span className="text-[var(--fg-muted)]">
                        {" "}
                        +{formatPrice(e.price, locale)}
                      </span>
                    </span>
                    {active && <Check className="size-3.5 text-[var(--accent)]" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]">
            {formatPrice(price, locale)}
          </span>
          <button
            type="button"
            disabled={!valid}
            onClick={submit}
            className="btn-primary disabled:opacity-40"
          >
            <Plus className="size-4" />
            {t("composer.add")}
          </button>
        </div>
        {!valid && showSauces && sauces.length < TACOS_MIN_SAUCES && (
          <p className="mt-3 text-xs text-[var(--fg-muted)]">
            {t("tacos.needSauces")}
          </p>
        )}
        {!valid && showMeats && meats.length !== tacosSize?.meats && (
          <p className="mt-3 text-xs text-[var(--fg-muted)]">
            {t("tacos.needMeats")}
          </p>
        )}
      </div>
    </div>
  );
}

export function findMenuItem(id: string) {
  return MENU_ITEMS.find((m) => m.id === id);
}
