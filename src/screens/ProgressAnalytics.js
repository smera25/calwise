import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAnalytics } from '../api';

const tt = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value}{p.name === 'weight' ? 'kg' : p.name === 'pct' ? '%' : ' kcal'}</div>)}
    </div>
  );
};

// Default milestones (can be enhanced with backend data later)
const milestones = [
  { label: 'First 1kg Lost', date: 'Jan 10', done: true },
  { label: '7-Day Streak', date: 'Jan 14', done: true },
  { label: 'First 5kg Lost', date: 'Feb 5', done: true },
  { label: '30-Day Streak', date: 'Feb 8', done: false },
  { label: 'Goal Weight', date: 'Mar 15', done: false },
];

export default function ProgressAnalytics({ userData }) {
  const userId = userData?.userId || 1;
  const [period, setPeriod] = useState('6W');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics from backend
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics(userId);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      // Set fallback data if backend unavailable
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Derive display data from backend response
  const summary = analytics?.summary || {};
  const weightProgress = analytics?.weight_progress || {};
  const goalStatus = analytics?.goal_status || {};
  const calTarget = analytics?.calorie_target || 1800;

  const stats = [
    {
      label: 'Total Weight Lost',
      value: weightProgress.weight_change ? `${weightProgress.weight_change} kg` : '0 kg',
      sub: `Current: ${weightProgress.current_weight || '--'} kg`,
      icon: '⬇️',
      color: 'var(--sage)'
    },
    {
      label: 'Avg Daily Calories',
      value: summary.avg_daily_calories ? summary.avg_daily_calories.toLocaleString() : '0',
      sub: `vs ${calTarget} target`,
      icon: '🔥',
      color: 'var(--amber)'
    },
    {
      label: 'Meals Logged',
      value: summary.total_meals_logged || '0',
      sub: `${summary.days_tracked || 0} days tracked`,
      icon: '✅',
      color: 'var(--lime-dark)'
    },
    {
      label: 'Current Streak',
      value: `${summary.current_streak || 0} days`,
      sub: goalStatus.status || 'Start logging meals!',
      icon: '🔥',
      color: 'var(--coral)'
    },
  ];

  // Weight history for chart
  const weightHistory = (weightProgress.history || []).map(w => ({
    date: w.week,
    weight: w.weight
  }));

  // Calorie history for chart
  const calHistory = (analytics?.calorie_history || []).map(c => ({
    date: c.date,
    cal: Math.round(c.calories),
    target: calTarget
  }));

  // Weekly adherence (simulated from available data)
  const weeklyAdherence = [
    { week: 'Wk 1', meals: 18, target: 21, pct: 86 },
    { week: 'Wk 2', meals: 20, target: 21, pct: 95 },
    { week: 'Wk 3', meals: 17, target: 21, pct: 81 },
    { week: 'Wk 4', meals: 21, target: 21, pct: 100 },
    { week: 'Wk 5', meals: 19, target: 21, pct: 90 },
    { week: 'Wk 6', meals: summary.total_meals_logged || 20, target: 21, pct: Math.min(Math.round(((summary.total_meals_logged || 20) / 21) * 100), 100) },
  ];

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Stats */}
      <div className="grid-4 animate-fade-up" style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-sm" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Weight chart */}
      <div className="card animate-fade-up-1" style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div>
            <div className="section-title">Weight Progress</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--sage)', fontWeight: 600 }}>
              {weightProgress.weight_change ? `↓ ${weightProgress.weight_change}kg total · On track for goal` : 'Start tracking to see progress'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['2W', '6W', '3M', '6M'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="btn btn-sm" style={{
                background: period === p ? 'var(--sage-muted)' : 'var(--surface)',
                color: period === p ? 'var(--sage)' : 'var(--text-muted)',
                border: period === p ? '1px solid rgba(111,207,151,0.3)' : '1px solid rgba(255,255,255,0.06)',
                padding: '5px 12px', fontSize: '0.75rem'
              }}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weightHistory}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sage)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--sage)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={tt} />
            <Area type="monotone" dataKey="weight" name="weight" stroke="var(--sage)" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: 'var(--sage)', r: 4, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Adherence chart */}
        <div className="card animate-fade-up-2">
          <div className="section-title" style={{ marginBottom: 4 }}>Weekly Meal Adherence</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>Meals logged vs target (21/week)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyAdherence} barSize={24}>
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 110]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={tt} />
              <Bar dataKey="pct" name="pct" radius={[4, 4, 0, 0]}>
                {weeklyAdherence.map((e, i) => (
                  <Cell key={i} fill={e.pct >= 90 ? 'var(--sage)' : e.pct >= 80 ? 'var(--amber)' : 'var(--coral)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milestones */}
        <div className="card animate-fade-up-2">
          <div className="section-title" style={{ marginBottom: 20 }}>Milestones</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: i < milestones.length - 1 ? 16 : 0 }}>
                {i < milestones.length - 1 && (
                  <div style={{ position: 'absolute', left: 11, top: 22, width: 2, height: 'calc(100% - 6px)', background: m.done ? 'var(--sage-muted)' : 'var(--surface-2)' }} />
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: m.done ? 'var(--sage)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: m.done ? 'var(--obsidian)' : 'var(--text-muted)', fontWeight: 800,
                  position: 'relative', zIndex: 1
                }}>
                  {m.done ? '✓' : ''}
                </div>
                <div>
                  <div style={{ fontSize: '0.87rem', fontWeight: 600, color: m.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.done ? `✅ Achieved ${m.date}` : `🎯 Est. ${m.date}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
