import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Archivo, Bodoni_Moda, Cairo, Cormorant_Garamond, Geist_Mono, Kalnia } from "next/font/google";
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

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nipreality.com",
  ),
  title: {
    default: "NIP Reality | Novel Insight Property",
    template: "%s | NIP Reality",
  },
  description:
    "Prudent, knowledge-first global real estate advisory for elevated living in Dubai.",
  openGraph: {
    siteName: "NIP Reality",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "NIP Reality — Novel Insight Property",
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
      className={`${archivo.variable} ${geistMono.variable} ${bodoni.variable} ${cormorant.variable} ${kalnia.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
