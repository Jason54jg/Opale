import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import { PageBackground } from "@/components/PageBackground";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Opale Neufchâteau — Kebabs & Fait Maison depuis 1999",
  description:
    "Restaurant kebab à Neufchâteau (Vosges). Sur place ou à emporter. Élu parmi les meilleurs kebabs des Vosges et de la Lorraine. 38 Rue de France — 03 29 94 16 94.",
  keywords: [
    "Opale",
    "kebab",
    "Neufchâteau",
    "Vosges",
    "fait maison",
    "tacos",
    "fast-food",
  ],
  openGraph: {
    title: "Opale Neufchâteau — Kebabs & Fait Maison",
    description:
      "Depuis 1999 à Neufchâteau. Kebabs, tacos et assiettes — qualité fait maison.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col bg-[var(--bg-deep)] text-[var(--fg)]">
        <PageBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
