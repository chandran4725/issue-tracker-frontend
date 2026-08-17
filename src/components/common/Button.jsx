import React from 'react';

const VARIANTS = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm focus:ring-brand-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400',
  outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-brand-500',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
  ghost: 'hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-md',
  md: 'px-4 py-2 text-sm font-medium rounded-lg',
  lg: 'px-5 py-2.5 text-base font-medium rounded-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2 -ml-0.5 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
