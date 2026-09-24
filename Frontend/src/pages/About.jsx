import React from 'react';
import { Info, ShieldAlert, Cpu, ArrowRight, BookOpen, Layers, CheckCircle2, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 py-4 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-3 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Academic Project Overview & Methodology</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
          About Smart Backlog Detection Predictor
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This machine learning system identifies students at risk of academic backlog using attendance patterns, self-study consistency, and classroom participation.
        </p>
      </div>

      {/* Process Flowchart Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Machine Learning Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="block text-xs font-bold text-indigo-300">1. Student Data</span>
            <span className="text-[10px] text-slate-400">1M CSV Records</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="block text-xs font-bold text-violet-300">2. Data Cleaning</span>
            <span className="text-[10px] text-slate-400">Pandas Engine</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="block text-xs font-bold text-purple-300">3. Feature Selection</span>
            <span className="text-[10px] text-slate-400">3 Key Features</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="block text-xs font-bold text-pink-300">4. Decision Tree</span>
            <span className="text-[10px] text-slate-400">max_depth=5</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="block text-xs font-bold text-emerald-300">5. Backlog Predict</span>
            <span className="text-[10px] text-slate-400">FastAPI + ML Engine</span>
          </div>
        </div>
      </div>

      {/* Target Definition & Features Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Features */}
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Prediction Input Features
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-white">Weekly Self Study Hours</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Numeric Feature</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-white">Attendance Percentage</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Percentage (0-100)</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-white">Class Participation</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Score / Rating</span>
            </li>
          </ul>
        </div>

        {/* Backlog Target Definition */}
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            Target Variable Rules
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
              <span className="font-bold text-rose-300">Grade F → Backlog = 1</span>
              <span className="text-[10px] font-extrabold text-rose-400 uppercase">Backlog Case</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <span className="font-bold text-emerald-300">Other Grades (A, B, C, D) → Backlog = 0</span>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase">Safe Case</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prevention of Data Leakage (Viva Answer) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Critical Viva Concept: Preventing Data Leakage
        </h3>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            In predictive modeling, <strong className="text-white">data leakage</strong> occurs when information from outside the training dataset (or target) is improperly used to make predictions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 block">Grade</span>
              <p className="text-[11px] text-slate-400">Used strictly to derive target <code className="text-indigo-300">backlog</code>. Cannot be used as an input feature.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 block">Total Score</span>
              <p className="text-[11px] text-slate-400">Reveals the academic outcome directly. Using it causes artificial 100% accuracy data leakage.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 block">Student ID</span>
              <p className="text-[11px] text-slate-400">Arbitrary record identifier with no statistical predictive correlation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
