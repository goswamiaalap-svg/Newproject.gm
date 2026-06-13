import type { Metadata } from 'next';
import { inter, outfit } from '@/lib/fonts';
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
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-bg-base text-text-primary antialiased min-h-screen`}>
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
