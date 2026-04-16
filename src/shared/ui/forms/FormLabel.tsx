import React from 'react';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export function FormLabel({ children, className = '', ...props }: FormLabelProps) {
  const baseClasses = "block mb-1.5 ml-1 text-sm font-bold text-slate-700 transition-colors duration-300";

  return (
    <label
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
