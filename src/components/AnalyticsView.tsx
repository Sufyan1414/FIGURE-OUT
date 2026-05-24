import { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { AnalyticsRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, MousePointer, ClipboardCheck, BarChart3, RotateCcw, AlertCircle, Heart } from 'lucide-react';

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsRecord | null>(null);

  const fetchLogs = () => {
    setData(analytics.get());
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 1000); // Poll every second for live telemetry
    return () => clearInterval(interval);
  }, []);

  const handleResetLogs = () => {
    if (!confirm('Are you sure you want to reset all analytical tracking telemetry logs?')) return;
    analytics.clear();
    fetchLogs();
  };

  if (!data) return null;

  // Process data for Recharts Click Distribution
  const clickDataset = Object.entries(data.clicks).map(([key, value]) => ({
    element: key.replace('project-open-', 'Proj ').replace('view-support-ticket-', 'Ticket ').replace('nav-btn-', 'Tab '),
    clicks: value,
  }));

  const clicksArray = Object.values(data.clicks) as number[];
  const clickSumValue = clicksArray.reduce((acc, curr) => acc + curr, 0);

  // Standard sample timeline coordinate dataset to show trends over recent weeks alongside actual telemetry views
  const trendDataset = [
    { name: 'Wk 19', views: 820, actions: 120 },
    { name: 'Wk 20', views: 1120, actions: 340 },
    { name: 'Wk 21', views: 980, actions: 290 },
    { name: 'Wk 22', views: 1450, actions: 580 },
    { name: 'Wk 23', views: 1850, actions: 920 },
    { name: 'Today', views: 1850 + data.pageViews, actions: 920 + clickSumValue },
  ];

  const totalClicksCount = clickSumValue;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-20" id="analytics-telemetry-panel">
      {/* Header and Telemetry actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c] bg-[#0fb58c]/5 px-3 py-1 rounded-full border border-[#0fb58c]/15">
            Operational Telemetry
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-2.5">
            Interaction Analytics
          </h1>
          <p className="text-zinc-550 dark:text-zinc-450 text-xs mt-1">
            Real-time tracking of visitor gestures, page transitions, and support entries across our portfolio.
          </p>
        </div>

        <div>
          <button
            id="reset-analytics-btn"
            onClick={handleResetLogs}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-500 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Wipe Analytics Logs
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="statistics-indicators-row">
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Page views</span>
          </div>
          <div className="font-sans text-3xl font-black text-zinc-900 dark:text-white">
            {data.pageViews}
          </div>
          <p className="font-sans text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
            Across active UI sessions
          </p>
        </div>

        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <MousePointer className="h-5 w-5 text-[#f9a007]" />
            <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Tactile Clicks</span>
          </div>
          <div className="font-sans text-3xl font-black text-zinc-900 dark:text-white">
            {totalClicksCount}
          </div>
          <p className="font-sans text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
            Recorded button & link presses
          </p>
        </div>

        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <ClipboardCheck className="h-5 w-5 text-emerald-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Forms sent</span>
          </div>
          <div className="font-sans text-3xl font-black text-zinc-900 dark:text-white">
            {data.formSubmissions}
          </div>
          <p className="font-sans text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
            Support tickets dispatches
          </p>
        </div>

        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Engagement</span>
          </div>
          <div className="font-sans text-3xl font-black text-zinc-900 dark:text-white">
            {data.pageViews > 0 ? ((totalClicksCount + data.formSubmissions * 3) / data.pageViews).toFixed(1) : '0.0'}
          </div>
          <p className="font-sans text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
            Calculated interaction score
          </p>
        </div>
      </div>

      {/* Visual Analytics Graphs using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8" id="telemetry-charts-layout">
        
        {/* Weekly Views and Actions area chart */}
        <div className="lg:col-span-7 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-5">
            <BarChart3 className="h-4.5 w-4.5 text-[#0fb58c]" /> Weekly Exposure Trends
          </h3>

          <div className="h-[280px]" id="views-trend-rechart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendDataset}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0fb58c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0fb58c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f9a007" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f9a007" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} strokeWidth={0.5} />
                <YAxis stroke="#a1a1aa" fontSize={11} strokeWidth={0.5} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="views" name="Exposure Views" stroke="#0fb58c" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="actions" name="Gestures / Clicks" stroke="#f9a007" strokeWidth={2} fillOpacity={1} fill="url(#colorActions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live click logs bar chart list */}
        <div className="lg:col-span-5 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-5">
            <MousePointer className="h-4.5 w-4.5 text-[#f9a007]" /> Dynamic Click Distribution
          </h3>

          {clickDataset.length === 0 ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center text-zinc-450 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl" id="clicks-chart-empty-state">
              <MousePointer className="h-8 w-8 text-zinc-400 mb-2 animate-bounce" />
              <p className="font-sans text-xs">
                No click operations recorded in log memory yet.
              </p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Browse our pages, projects, and switches to feed this bar graph immediately.
              </p>
            </div>
          ) : (
            <div className="h-[280px]" id="clicks-rechart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickDataset} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="hidden dark:block" />
                  <XAxis type="number" stroke="#a1a1aa" fontSize={10} strokeWidth={0.5} />
                  <YAxis type="category" dataKey="element" stroke="#a1a1aa" fontSize={9} width={90} strokeWidth={0.5} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderRadius: '8px', 
                      border: 'none', 
                      color: '#fff',
                      fontSize: '11px'
                    }} 
                  />
                  <Bar dataKey="clicks" fill="#f9a007" name="Clicks" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Session Telemetry Ledger */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm" id="session-telemetry-panel">
        <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
          <span className="w-2.5 h-1.5 bg-[#0fb58c] rounded-full animate-pulse" /> Live Telemetry Ledger
        </h3>

        <div className="p-4 bg-zinc-100/40 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/50 dark:border-zinc-801/50">
          <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 leading-normal" id="telemetry-logs-scroll-box">
            {data.sessionTimeline.length === 0 ? (
              <div className="text-zinc-500 py-4 text-center">No telemetries logged. Welcome to Figure Out web workspace.</div>
            ) : (
              data.sessionTimeline.slice().reverse().map((entry, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-1 sm:gap-4 p-2 border-b border-zinc-200/40 dark:border-zinc-800/40 last:border-0 hover:bg-zinc-200/10 transition-colors">
                  <span className="text-[#0fb58c] font-semibold shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold shrink-0">
                    [{entry.event}]
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-250">
                    {entry.detail || 'Generic operation completed.'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 justify-end text-[10px] text-zinc-400 mt-3 font-mono">
          <AlertCircle className="h-3 w-3" /> Ledger sync active (buffered every 1.0s)
        </div>
      </div>
    </div>
  );
}
