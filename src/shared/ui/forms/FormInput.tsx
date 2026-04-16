import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string | boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = '', icon, rightElement, error, ...props }, ref) => {
    return (
      <div className="w-full group">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-blue z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            style={{ fontWeight: 'var(--dds-form-input-weight, 700)', ...(props.style || {}) }}
            className={`w-full bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-input)] outline-none text-brand-navy transition-all focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 shadow-sm focus:shadow-xl focus:shadow-brand-blue/5 disabled:opacity-50 disabled:cursor-not-allowed ${icon ? "pl-11" : "px-4"} ${rightElement ? "pr-12" : "pr-4"} py-3.5 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              {rightElement}
            </div>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {typeof error === 'string' && error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -5 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={12} className="shrink-0" />
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
