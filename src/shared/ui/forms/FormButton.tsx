import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ className = '', variant = 'primary', isLoading, icon, children, disabled, ...props }, ref) => {
    
    let variantClasses = '';
    if (variant === 'primary') {
      variantClasses = 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/30';
    } else if (variant === 'secondary') {
      variantClasses = 'bg-slate-100 text-brand-navy hover:bg-slate-200';
    } else if (variant === 'outline') {
      variantClasses = 'border-2 border-slate-200 text-brand-navy hover:border-brand-blue hover:text-brand-blue';
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`w-full py-4 font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-brand-button)] ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

FormButton.displayName = 'FormButton';
