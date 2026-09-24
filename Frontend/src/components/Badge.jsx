import React from 'react';

export default function Badge({ variant = 'indigo', children }) {
  const variants = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    slate: 'bg-slate-800 border-slate-700 text-slate-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant] || variants.indigo}`}>
      {children}
    </span>
  );
}
