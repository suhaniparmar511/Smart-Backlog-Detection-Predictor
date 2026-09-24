import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'group-hover:border-indigo-500/50'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/50'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'group-hover:border-rose-500/50'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'group-hover:border-amber-500/50'
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      glow: 'group-hover:border-violet-500/50'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`
      relative p-5 rounded-2xl bg-slate-900/80 backdrop-blur border ${scheme.border} ${scheme.glow}
      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group
    `}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
