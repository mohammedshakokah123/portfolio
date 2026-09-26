import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LazyToaster } from "@/components/shared/lazy-toaster";
import { site } from "@/content/site";
import { defaultTitle, sharedOpenGraph, sharedTwitter } from "@/lib/seo/metadata";

import "./globals.css";

// الـ canonical والـ og:url والـ profile بـ app/page.tsx مش هون: كل صفحة ما بتعرّفهم (متل الـ 404)
// كانت بتورثهم وبتقول لـ Google إنها نسخة عن الرئيسية
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    title: defaultTitle,
    description: site.ogDescription,
  },
  twitter: { ...sharedTwitter, title: defaultTitle, description: site.ogDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // من Search Console
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <SkipLink />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <SiteFooter />
          <LazyToaster />
          <RevealObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
