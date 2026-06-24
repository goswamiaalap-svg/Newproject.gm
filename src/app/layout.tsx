import type { Metadata } from 'next';
import { inter, serif, mono } from '@/lib/fonts';
import './globals.css';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import LenisProvider from '@/providers/LenisProvider';
import ScrollProgress from '@/components/shared/ScrollProgress';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'LaunchPad — AI-Powered Career Platform',
  description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
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
        </body>
      </html>
    </ClerkProvider>
  );
}

