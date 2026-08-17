import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[var(--sg-sand)]', className)}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--sg-forest)] border-r-transparent', className)} />
  );
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--sg-stone)] rounded-xl bg-[var(--sg-cream)]">
      {icon && <div className="mb-4 text-[var(--sg-warm-gray)]">{icon}</div>}
      <h4 className="text-sm font-bold text-[var(--sg-charcoal)]">{title}</h4>
      {description && <p className="text-xs text-[var(--sg-warm-gray)] mt-1.5 max-w-sm">{description}</p>}
    </div>
  );
}

export function ErrorState({ title, description, onRetry }: { title: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-[var(--sg-danger)]/20 rounded-xl bg-[var(--sg-danger)]/5">
      <div className="w-12 h-12 rounded-full bg-[var(--sg-danger)]/10 flex items-center justify-center mb-4">
        <span className="text-[var(--sg-danger)] text-xl">!</span>
      </div>
      <h4 className="text-sm font-bold text-[var(--sg-charcoal)]">{title}</h4>
      {description && <p className="text-xs text-[var(--sg-warm-gray)] mt-1.5 max-w-sm">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-4 px-4 py-2 text-xs font-semibold text-[var(--sg-danger)] border border-[var(--sg-danger)]/30 rounded-lg hover:bg-[var(--sg-danger)]/10 transition-colors">
          Try Again
        </button>
      )}
    </div>
  );
}
