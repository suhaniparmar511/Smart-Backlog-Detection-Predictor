import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Percent, 
  Clock, 
  CalendarCheck, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getDashboard, getDatasetInfo } from '../services/api';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];
const BACKLOG_COLORS = ['#f43f5e', '#10b981'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [gradeData, setGradeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, datasetRes] = await Promise.all([
        getDashboard(),
        getDatasetInfo()
      ]);

      setData(dashRes);

      if (datasetRes && datasetRes.grade_distribution) {
        const formattedGrades = Object.entries(datasetRes.grade_distribution).map(([grade, count]) => ({
          grade,
          count
        }));
        setGradeData(formattedGrades);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to connect to FastAPI backend. Ensure server is running on http://127.0.0.1:8000.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Fetching dashboard metrics from FastAPI backend..." />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Connection Error</h3>
        <p className="text-xs text-rose-300">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const backlogPieData = [
    { name: 'Backlog (Grade F)', value: data.backlog_students },
    { name: 'No Backlog (Grades A-D)', value: data.non_backlog_students }
  ];

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Academic Overview</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Good day 👋 Smart Backlog Detection Dashboard
          </h1>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={data.total_students}
          subtitle="Dataset total records"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Backlog Students"
          value={data.backlog_students}
          subtitle="Grade F target cases"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="No Backlog Students"
          value={data.non_backlog_students}
          subtitle="Passed students (A, B, C, D)"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Backlog Percentage"
          value={`${data.backlog_percentage}%`}
          subtitle="Class imbalance ratio"
          icon={Percent}
          color="amber"
        />
      </div>

      {/* Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <ChartCard title="Grade Distribution" subtitle="Overall student breakdown across grades A, B, C, D, F">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.grade === 'F' ? '#f43f5e' : COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Backlog vs No Backlog Distribution */}
        <ChartCard title="Backlog Target Ratio" subtitle="Machine Learning binary target proportion">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={backlogPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {backlogPieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={BACKLOG_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Average Performance Indicators */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">Student Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Average Attendance</span>
              <p className="text-lg font-bold text-white">{data.average_attendance}%</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Average Self Study</span>
              <p className="text-lg font-bold text-white">{data.average_study_hours} hrs/wk</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Class Participation</span>
              <p className="text-lg font-bold text-white">{data.average_participation} / 10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Prediction CTA Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Machine Learning Inference
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Ready to evaluate a student's risk?</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Input self-study hours, attendance percentage, and class participation to receive an instant statistical backlog prediction.
          </p>
        </div>
        <a
          href="/predict"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <span>Run Prediction</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
