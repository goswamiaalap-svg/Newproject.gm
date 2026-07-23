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
  title: 'LaunchPad — AI-Powered Career Platform',
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
    'software engineering jobs'
  ],
  alternates: {
    canonical: BASE_URL,
  },
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
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchPad — AI-Powered Career Platform',
    description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
    images: ['/student_desk_flatlay.png'],
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
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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

