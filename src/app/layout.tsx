import type { Metadata } from 'next';
import { inter, syne } from '@/lib/fonts';
import './globals.css';
import { ReducedMotionProvider } from '@/providers/ReducedMotionProvider';
import LenisProvider from '@/providers/LenisProvider';
import CustomCursor from '@/components/shared/CustomCursor';
import ScrollProgress from '@/components/shared/ScrollProgress';
import dynamic from 'next/dynamic';

// Load ambient canvas only on client (WebGL)
const AmbientCanvas = dynamic(
  () => import('@/components/three/AmbientCanvas'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'LaunchPad — AI-Powered Career Platform',
  description: 'The all-in-one AI career platform for engineering students. Resume review, DSA roadmap, mock interviews, and more.',
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
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${syne.variable} font-sans bg-bg-base text-text-primary antialiased min-h-screen`}>
        <ReducedMotionProvider>
          <LenisProvider>
            {/* Persistent ambient particle canvas behind everything */}
            <AmbientCanvas />
            <CustomCursor />
            <ScrollProgress />
            {children}
          </LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
