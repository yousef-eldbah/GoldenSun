import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  const variants: Record<string, string> = {
    default: 'bg-white border border-[var(--sg-sand)]',
    elevated: 'bg-white border border-[var(--sg-sand)] shadow-lg shadow-black/5',
    bordered: 'bg-[var(--sg-cream)] border-2 border-[var(--sg-stone)]',
    dark: 'bg-[var(--sg-forest)] text-white border border-[var(--sg-leaf)]',
  };

  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn('rounded-xl', variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-b border-[var(--sg-sand)] pb-4 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold text-[var(--sg-charcoal)]', className)} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-[var(--sg-warm-gray)]', className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-t border-[var(--sg-sand)] pt-4 mt-4', className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
