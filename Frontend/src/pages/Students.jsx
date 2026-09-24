import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Layers, CheckCircle2, AlertTriangle, FileText, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDatasetInfo } from '../services/api';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';

const GRADE_COLORS = {
  A: '#6366f1',
  B: '#8b5cf6',
  C: '#a855f7',
  D: '#ec4899',
  F: '#f43f5e'
};

export default function Students() {
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatasetInfo();
  }, []);

  const fetchDatasetInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDatasetInfo();
      setInfo(data);
    } catch (err) {
      console.error("Error fetching dataset info:", err);
      setError("Failed to load student dataset metadata from FastAPI backend.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Analyzing dataset statistics from CSV via FastAPI..." />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Dataset API Error</h3>
        <p className="text-xs text-rose-300">{error}</p>
        <button
          onClick={fetchDatasetInfo}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const gradeChartData = Object.entries(info.grade_distribution || {}).map(([grade, count]) => ({
    grade,
    count
  }));

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Data Analytics</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Student Dataset Statistics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Source: <span className="text-slate-200 font-semibold">student_performance.csv</span> • Processed server-side with Pandas
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={info.total_students}
          subtitle="Total CSV rows"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Features / Columns"
          value={info.total_columns}
          subtitle="Dataset dimensions"
          icon={Layers}
          color="violet"
        />
        <StatCard
          title="Backlog Students (Grade F)"
          value={info.backlog_students}
          subtitle={`${info.backlog_percentage}% of total`}
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Non-Backlog Students"
          value={info.non_backlog_students}
          subtitle="Passed students"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Dataset Quality & Column Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quality Metrics */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Dataset Quality & Integrity
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Missing Values</span>
              <span className="font-bold text-emerald-400">{info.missing_values} (Clean)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Duplicate Rows</span>
              <span className="font-bold text-emerald-400">{info.duplicate_rows} (Unique)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Average Total Score</span>
              <span className="font-bold text-indigo-300">{info.average_total_score} / 100</span>
            </div>
          </div>
        </div>

        {/* Dataset Schema Columns */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Dataset Schema Columns
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {info.columns?.map((col) => {
              const isFeature = ["weekly_self_study_hours", "attendance_percentage", "class_participation"].includes(col);
              const isTarget = col === "grade";
              const isExcluded = ["student_id", "total_score"].includes(col);

              return (
                <div key={col} className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  isFeature 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' 
                    : isTarget 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span className="font-mono font-semibold truncate">{col}</span>
                  <span className="text-[10px] mt-1 opacity-75 font-bold uppercase">
                    {isFeature ? 'ML Input Feature' : isTarget ? 'Target Generator' : 'Excluded Feature'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grade Breakdown Visual Chart */}
      <ChartCard title="Grade Distribution Breakdown" subtitle="Exact counts from 1,000,000 student records">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gradeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {gradeChartData.map((entry) => (
                <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
