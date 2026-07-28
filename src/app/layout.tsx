import type { Metadata } from 'next';
import { inter, serif, mono } from '@/lib/fonts';
import './globals.css';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import LenisProvider from '@/providers/LenisProvider';
import ScrollProgress from '@/components/shared/ScrollProgress';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

const BASE_URL = 'https://hyperbase.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'LaunchPad — AI-Powered Career Platform',
    template: '%s | LaunchPad',
  },
  description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
  keywords: [
    'AI career platform',
    'resume review',
    'DSA roadmap',
    'mock interviews',
    'engineering students',
    'placement prep',
    'interview preparation',
    'career guidance',
    'software engineering jobs',
  ],
  // Canonical & language
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en': BASE_URL,
    },
  },
  // Robots
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
  // Open Graph
  openGraph: {
    title: 'LaunchPad — AI-Powered Career Platform',
    description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
    url: BASE_URL,
    siteName: 'LaunchPad',
    images: [
      {
        url: '/student_desk_flatlay.png',
        width: 1200,
        height: 630,
        alt: 'LaunchPad AI Career Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchPad — AI-Powered Career Platform',
    description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
    images: ['/student_desk_flatlay.png'],
  },
  // App / PWA
  applicationName: 'LaunchPad',
  appleWebApp: {
    capable: true,
    title: 'LaunchPad',
    statusBarStyle: 'default',
  },
  // Verification
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

// Inline, blocking theme script — runs before paint to avoid a flash of the wrong theme.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('launchpad-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Theme flicker prevention — must be first script */}
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

          {/* PWA / Browser chrome color */}
          <meta name="theme-color" content="#F5F5F3" />
          <meta name="msapplication-TileColor" content="#F5F5F3" />

          {/* Critical font preloads — eliminates FOIT/FOUT for above-the-fold text */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          {/* Favicon — proper small sizes */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

          {/* DNS prefetch for external services */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={`${inter.variable} ${serif.variable} ${mono.variable} font-sans bg-bg-base text-text-primary antialiased min-h-screen transition-colors duration-300`}>
          <ThemeProvider>
            <ReducedMotionProvider>
              <LenisProvider>
                <ScrollProgress />
                {children}
              </LenisProvider>
            </ReducedMotionProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
