'use client';

import { cn } from '@/lib/utils';

interface AmbientBlobsProps {
  className?: string;
}

export default function AmbientBlobs({ className }: AmbientBlobsProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 overflow-hidden -z-10',
        className
      )}
      aria-hidden="true"
    >
      {/* Blob 1: Teal — top-right */}
      <div
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full blur-3xl motion-safe:animate-float-slow"
        style={{
          backgroundColor: '#0D9488',
          opacity: 0.07,
        }}
      />

      {/* Blob 2: Indigo — bottom-left */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl motion-safe:animate-float-slower"
        style={{
          backgroundColor: '#6366F1',
          opacity: 0.06,
        }}
      />

      {/* Blob 3: Gold — center-right */}
      <div
        className="absolute top-1/2 -right-24 w-[400px] h-[400px] rounded-full blur-3xl motion-safe:animate-float-slowest"
        style={{
          backgroundColor: '#F59E0B',
          opacity: 0.04,
        }}
      />
    </div>
  );
}
