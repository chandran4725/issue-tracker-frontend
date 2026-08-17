import React from 'react';

const BADGE_VARIANTS = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200/60',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200/60',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
  ADMIN: 'bg-purple-50 text-purple-700 border-purple-200/60',
  MANAGER: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  DEVELOPER: 'bg-sky-50 text-sky-700 border-sky-200/60',
  default: 'bg-slate-50 text-slate-600 border-slate-200',
};

export function Badge({ variant = 'default', children, className = '' }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}
