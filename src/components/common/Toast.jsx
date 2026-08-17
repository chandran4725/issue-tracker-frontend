import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const ICONS = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const BORDERS = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-rose-500',
    info: 'border-l-4 border-l-blue-500',
  };

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-3 p-4 bg-white rounded-lg shadow-lg border border-slate-100 ${BORDERS[type]} animate-slide-in`}>
      <div className="flex items-center gap-3">
        {ICONS[type]}
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
