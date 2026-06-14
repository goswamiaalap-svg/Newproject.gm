import type { Metadata } from 'next';
import './globals.css';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import LenisProvider from '@/providers/LenisProvider';
import ScrollProgress from '@/components/shared/ScrollProgress';

export const metadata: Metadata = {
  title: 'LaunchPad — AI-Powered Career Platform',
  description: 'The all-in-one AI career platform for engineering students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-bg-base text-text-primary antialiased min-h-screen">
        <ReducedMotionProvider>
          <LenisProvider>
            <ScrollProgress />
            {children}
          </LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
