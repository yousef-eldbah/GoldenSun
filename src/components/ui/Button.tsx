import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-gold)] focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

    const variants: Record<string, string> = {
      primary:
        'bg-[var(--sg-forest)] hover:bg-[var(--sg-leaf)] text-white shadow-sm',
      secondary:
        'bg-[var(--sg-sand)] hover:bg-[var(--sg-stone)] text-[var(--sg-charcoal)] border border-[var(--sg-stone)]',
      ghost:
        'bg-transparent hover:bg-[var(--sg-sand)] text-[var(--sg-charcoal)]',
      danger:
        'bg-[var(--sg-danger)] hover:bg-red-700 text-white shadow-sm',
      outline:
        'bg-transparent border-2 border-[var(--sg-forest)] text-[var(--sg-forest)] hover:bg-[var(--sg-forest)] hover:text-white',
      dark:
        'bg-[var(--sg-charcoal)] hover:bg-[var(--sg-black)] text-white shadow-sm',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3.5 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
