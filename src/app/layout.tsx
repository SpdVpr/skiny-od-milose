import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skiny od Miloše CS2 Skiny",
  description: "Výkup, prodej i skiny na objednávku – vše na jednom místě. Bezpečnost, rychlost a spolehlivost. Tisíce uzavřených obchodů a stovky spokojených zákazníků. S Vámi od roku 2023 jako ověřený partner na cestě k vašemu vysněnému skinu do hry Counter Strike 2.",
  keywords: ["CS2 skiny", "Counter Strike 2", "CS:GO skiny", "nože CS2", "rukavice CS2", "výkup skinů", "prodej skinů", "skiny na objednávku"],
  authors: [{ name: "Skiny od Miloše" }],
  creator: "Skiny od Miloše",
  publisher: "Skiny od Miloše",
  metadataBase: new URL('https://www.skinyodmilose.cz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.skinyodmilose.cz',
    siteName: 'Skiny od Miloše',
    title: 'Skiny od Miloše CS2 Skiny',
    description: 'Výkup, prodej i skiny na objednávku – vše na jednom místě. Bezpečnost, rychlost a spolehlivost. Tisíce uzavřených obchodů a stovky spokojených zákazníků.',
    images: [
      {
        url: '/social.png',
        width: 1200,
        height: 630,
        alt: 'Skiny od Miloše - CS2 Skiny',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skiny od Miloše CS2 Skiny',
    description: 'Výkup, prodej i skiny na objednávku – vše na jednom místě. Bezpečnost, rychlost a spolehlivost.',
    images: ['/social.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&subset=latin,latin-ext&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
