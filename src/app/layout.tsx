import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { baloo2, notoSans, notoSansDevanagari, notoSansTamil } from "@/styles/fonts";
import { I18nProvider } from "@/i18n/provider";

import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Bhāṣā — Learn Sanskrit step by step",
  description:
    "Learn to read, understand, and speak simple Sanskrit step by step, in the language you already think in (English & Tamil).",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bhāṣā",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7C2D12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${baloo2.variable} ${notoSans.variable} ${notoSansDevanagari.variable} ${notoSansTamil.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased transition-colors duration-150"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <I18nProvider>
          <ServiceWorkerRegister />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
