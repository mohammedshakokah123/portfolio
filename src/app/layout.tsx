import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";

import { GameRoot } from "@/components/game/game-root";
import { GroundBar } from "@/components/game/ground-bar";
import { PauseMenu } from "@/components/game/pause-menu";
import { Hud } from "@/components/layout/hud";
import { Overlays } from "@/components/layout/overlays";
import { SkipLink } from "@/components/layout/skip-link";
import { Floor, HeroLayer, World } from "@/components/layout/world";
import { site } from "@/content/site";
import { bootScript } from "@/game/boot";
import { defaultTitle, sharedOpenGraph, sharedTwitter } from "@/lib/seo/metadata";

import "./globals.css";

// self-hosted: ما في request لـ Google. الـ variable بتنحط عالـ <html> وبتنقرأ بـ tokens.css
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});
// خط variable (400–700): التصميم بيستعمل 400 و500 و600
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  display: "swap",
});

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
  themeColor: "#14142B", // النهار. المحرك بيبدّلها لـ #0E1236 بالليل (المرحلة 05)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // القيم الافتراضية (home، day) هي اللي بيشوفها اللي مطفّي الـ JS. الـ boot script بيصححها قبل أول paint،
    // فالـ DOM بيختلف عن اللي React متوقعه ← suppressHydrationWarning
    <html
      lang="en"
      data-stage="home"
      data-time="day"
      className={`${pressStart.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SkipLink />
        <Hud />
        <World />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <HeroLayer />
        <Floor />
        <GroundBar name={site.name} year={new Date().getFullYear()} />
        <Overlays />
        <PauseMenu />
        <GameRoot siteName={site.name} homeTitle={defaultTitle} />
      </body>
    </html>
  );
}
