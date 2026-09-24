import React from 'react';
import { Inbox, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  title = "No prediction records found", 
  message = "You haven't run any student backlog risk predictions yet.",
  actionText = "Predict Backlog Risk",
  actionLink = "/predict"
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/50">
        <Inbox className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{message}</p>
      </div>
      {actionLink && (
        <Link
          to={actionLink}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
