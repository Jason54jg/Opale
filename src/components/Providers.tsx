"use client";

import { useEffect } from "react";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider, useI18n } from "@/i18n/context";
import { Analytics } from "./Analytics";

function LangSync({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LangSync>
        <CartProvider>
          <Analytics />
          {children}
        </CartProvider>
      </LangSync>
    </I18nProvider>
  );
}
