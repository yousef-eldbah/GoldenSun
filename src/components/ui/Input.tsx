import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--sg-charcoal)]">{label}</label>}
        <div className="relative">
          {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sg-warm-gray)]" aria-hidden="true">{leftIcon}</span>}
          <input
            ref={ref} id={inputId}
            className={cn(
              'w-full rounded-lg bg-white border text-sm text-[var(--sg-charcoal)] placeholder-[var(--sg-stone)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--sg-forest)]/30 focus:border-[var(--sg-forest)] transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9 pr-4' : 'px-4', 'py-2.5',
              error ? 'border-[var(--sg-danger)] focus:ring-[var(--sg-danger)]/30' : 'border-[var(--sg-stone)]',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        {error && <p id={`${inputId}-error`} className="text-xs text-[var(--sg-danger)] font-medium" role="alert">{error}</p>}
        {!error && helperText && <p id={`${inputId}-helper`} className="text-xs text-[var(--sg-warm-gray)]">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={textareaId} className="block text-xs font-semibold text-[var(--sg-charcoal)]">{label}</label>}
        <textarea
          ref={ref} id={textareaId}
          className={cn(
            'w-full rounded-lg bg-white border px-4 py-2.5 text-sm text-[var(--sg-charcoal)] placeholder-[var(--sg-stone)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--sg-forest)]/30 focus:border-[var(--sg-forest)] transition-colors',
            'disabled:opacity-50 min-h-[80px] resize-y',
            error ? 'border-[var(--sg-danger)]' : 'border-[var(--sg-stone)]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && <p className="text-xs text-[var(--sg-danger)] font-medium" role="alert">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--sg-charcoal)]">{label}</label>}
        <select
          ref={ref} id={selectId}
          className={cn(
            'w-full rounded-lg bg-white border px-4 py-2.5 text-sm text-[var(--sg-charcoal)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--sg-forest)]/30 focus:border-[var(--sg-forest)] transition-colors',
            'disabled:opacity-50',
            error ? 'border-[var(--sg-danger)]' : 'border-[var(--sg-stone)]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
        {error && <p className="text-xs text-[var(--sg-danger)] font-medium" role="alert">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Input, Textarea, Select };
