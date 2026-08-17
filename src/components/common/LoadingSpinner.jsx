import React from 'react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200"></div>
        <div className="w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {message && <p className="mt-3 text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );
}
