import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'green' | 'blue' | 'red' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'green', size = 'sm', children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    gold: 'bg-[var(--sg-gold)]/10 text-[var(--sg-gold-dark)] border-[var(--sg-gold)]/20',
    green: 'bg-[var(--sg-forest)]/8 text-[var(--sg-forest)] border-[var(--sg-forest)]/15',
    blue: 'bg-[var(--sg-info)]/10 text-[var(--sg-info)] border-[var(--sg-info)]/20',
    red: 'bg-[var(--sg-danger)]/10 text-[var(--sg-danger)] border-[var(--sg-danger)]/20',
    neutral: 'bg-[var(--sg-sand)] text-[var(--sg-warm-gray)] border-[var(--sg-stone)]',
    dark: 'bg-[var(--sg-charcoal)] text-white border-[var(--sg-charcoal)]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-md uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
