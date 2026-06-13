import { cn } from '@/lib/utils';

interface SkeletonBaseProps {
  className?: string;
}

const shimmerClass = 'animate-shimmer bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]';

export function SkeletonCard({ className }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 space-y-4',
        shimmerClass,
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <div className="h-40 rounded-xl bg-slate-700/50" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-700/50" />
        <div className="h-4 w-1/2 rounded bg-slate-700/50" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-700/50" />
        <div className="h-6 w-16 rounded-full bg-slate-700/50" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonTextProps extends SkeletonBaseProps {
  width?: string;
}

export function SkeletonText({ width = '100%', className }: SkeletonTextProps) {
  return (
    <div
      className={cn('h-4 rounded', shimmerClass, className)}
      style={{ width }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonCircleProps extends SkeletonBaseProps {
  size?: number;
}

export function SkeletonCircle({ size = 48, className }: SkeletonCircleProps) {
  return (
    <div
      className={cn('rounded-full', shimmerClass, className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonBarProps extends SkeletonBaseProps {
  height?: number;
}

export function SkeletonBar({ height = 12, className }: SkeletonBarProps) {
  return (
    <div
      className={cn('w-full rounded-full', shimmerClass, className)}
      style={{ height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
