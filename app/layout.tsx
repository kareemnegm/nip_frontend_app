import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Almarai, Archivo, Bodoni_Moda, Cormorant_Garamond, Geist_Mono, Kalnia } from "next/font/google";
import { AnalyticsRouteTracker } from "@/components/analytics/AnalyticsRouteTracker";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import { defaultLocale, getDirection, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-didone",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const kalnia = Kalnia({
  variable: "--font-kalnia",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  // Relative og:image paths are resolved against this — a wrong host here makes
  // every social preview image unfetchable. The live domain is niprealty.com.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://niprealty.com",
  ),
  title: {
    default: "Novel Insight Property - Dubai Real Estate Advisory",
    template: "%s - Novel Insight Property",
  },
  description:
    "Novel Insight Property — NIP brings together market insight, editorial perspective, and private advisory for clients who want to move with judgment.",
  icons: {
    icon: [
      { url: "/brand/logo-small.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/brand/logo-small.png",
    apple: "/brand/logo-square-rounded.png",
  },
  // Google Search Console — renders <meta name="google-site-verification" …>.
  // Must stay in place for as long as the property is verified.
  verification: {
    google: "ywaooa3OraOvKyx6tnSbU3IRcjnnj1Czo4dkORX1mf8",
  },
  openGraph: {
    siteName: "Novel Insight Property",
    type: "website",
    images: [
      {
        // 1200×630, ~100KB. hero-bg.jpg is 4096px/14MB — scrapers time out on it.
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Novel Insight Property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${archivo.variable} ${geistMono.variable} ${bodoni.variable} ${cormorant.variable} ${kalnia.variable} ${almarai.variable} h-full antialiased`}
    >
      <head>
        <GoogleTagManager />
        <GoogleAnalytics />
      </head>
      <body className="flex min-h-full flex-col">
        <GoogleTagManagerNoScript />
        <AnalyticsRouteTracker />
        {children}
      </body>
    </html>
  );
}
