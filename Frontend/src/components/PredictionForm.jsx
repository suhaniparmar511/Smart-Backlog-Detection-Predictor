import React, { useState } from 'react';
import { Sparkles, Clock, CalendarCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function PredictionForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    weekly_self_study_hours: 8,
    attendance_percentage: 75,
    class_participation: 5
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validations
    if (formData.weekly_self_study_hours === '' || formData.weekly_self_study_hours < 0) {
      setError("Weekly self-study hours cannot be negative.");
      return;
    }
    if (formData.attendance_percentage === '' || formData.attendance_percentage < 0 || formData.attendance_percentage > 100) {
      setError("Attendance percentage must be between 0% and 100%.");
      return;
    }
    if (formData.class_participation === '' || formData.class_participation < 0) {
      setError("Class participation score cannot be negative.");
      return;
    }

    onSubmit({
      weekly_self_study_hours: Number(formData.weekly_self_study_hours),
      attendance_percentage: Number(formData.attendance_percentage),
      class_participation: Number(formData.class_participation)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 lg:p-8 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800/80 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Student Academic Input
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide current academic indicators to predict potential backlog risk using Decision Tree ML.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Weekly Self Study Hours */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Weekly Self Study Hours
            </span>
            <span className="text-[11px] text-slate-400">Hours per week</span>
          </label>
          <input
            type="number"
            name="weekly_self_study_hours"
            step="0.1"
            min="0"
            max="168"
            required
            value={formData.weekly_self_study_hours}
            onChange={handleChange}
            placeholder="e.g. 8.5"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>

        {/* Attendance Percentage */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
              Attendance Percentage
            </span>
            <span className="text-[11px] text-slate-400">0% to 100%</span>
          </label>
          <input
            type="number"
            name="attendance_percentage"
            step="0.1"
            min="0"
            max="100"
            required
            value={formData.attendance_percentage}
            onChange={handleChange}
            placeholder="e.g. 72.0"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>

        {/* Class Participation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Class Participation
            </span>
            <span className="text-[11px] text-slate-400">Score / Rating</span>
          </label>
          <input
            type="number"
            name="class_participation"
            step="0.1"
            min="0"
            max="10"
            required
            value={formData.class_participation}
            onChange={handleChange}
            placeholder="e.g. 5.0"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span>Analyzing Risk with ML Model...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Predict Backlog Risk</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        * Note: Grade and Total Score are intentionally excluded to prevent data leakage in ML predictions.
      </p>
    </form>
  );
}
