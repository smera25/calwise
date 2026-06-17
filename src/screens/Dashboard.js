import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getDailyNutrition, getAnalytics } from '../api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value} {payload[0].name === 'weight' ? 'kg' : 'kcal'}</div>
    </div>
  );
};

export default function Dashboard({ navigate, userData, showToast }) {
  const userId = userData?.userId || 1;
  const rawName = userData?.name || userData?.profile?.name || 'Aarav';
  const name = rawName.trim() === '' ? 'Aarav' : rawName.split(' ')[0];

  const [nutrition, setNutrition] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDailyNutrition(userId).catch(() => null),
      getAnalytics(userId).catch(() => null)
    ]).then(([nutData, anaData]) => {
      setNutrition(nutData);
      setAnalytics(anaData);
    }).finally(() => setLoading(false));
  }, []);

  // Derive values from backend data (with fallbacks)
  const cal = nutrition?.total_calories || 0;
  const target = nutrition?.calorie_target || 1800;
  const pct = target > 0 ? Math.round((cal / target) * 100) : 0;
  const totalProt = nutrition?.total_protein || 0;
  const totalCarb = nutrition?.total_carbs || 0;
  const totalFat = nutrition?.total_fats || 0;
  const streak = analytics?.summary?.current_streak || 0;

  const todayMeals = (nutrition?.meals || []).map(m => ({
    label: m.meal_type || 'Meal',
    name: m.food_name,
    cal: m.calories,
    status: 'done',
    icon: m.meal_type === 'Breakfast' ? '🥣' : m.meal_type === 'Lunch' ? '🍛' : m.meal_type === 'Dinner' ? '🍽️' : '🥛'
  }));

  // If no meals yet, show placeholder meals
  const displayMeals = todayMeals.length > 0 ? todayMeals : [
    { label: 'Breakfast', name: 'Not logged yet', cal: 0, status: 'pending', icon: '🥣' },
    { label: 'Lunch', name: 'Not logged yet', cal: 0, status: 'pending', icon: '🍛' },
    { label: 'Dinner', name: 'Not logged yet', cal: 0, status: 'pending', icon: '🍽️' },
    { label: 'Snack', name: 'Not logged yet', cal: 0, status: 'pending', icon: '🥛' },
  ];

  const macros = [
    { label: 'Protein', val: totalProt, max: 120, unit: 'g', color: 'var(--sage)', pct: Math.min(Math.round((totalProt / 120) * 100), 100) },
    { label: 'Carbs', val: totalCarb, max: 225, unit: 'g', color: 'var(--sky)', pct: Math.min(Math.round((totalCarb / 225) * 100), 100) },
    { label: 'Fats', val: totalFat, max: 60, unit: 'g', color: 'var(--amber)', pct: Math.min(Math.round((totalFat / 60) * 100), 100) },
  ];

  // Weight data from analytics
  const weightProgress = analytics?.weight_progress || {};
  const weightData = (weightProgress.history || []).map(w => ({
    day: w.week.replace('Week ', 'W'),
    weight: w.weight
  }));

  // Calorie history from analytics
  const calHistory = analytics?.calorie_history || [];
  const calData = calHistory.length > 0
    ? calHistory.map(c => ({ day: c.date.slice(5), cal: Math.round(c.calories) }))
    : [{ day: 'Today', cal }];

  const avgCal = calData.length > 0 ? Math.round(calData.reduce((s, c) => s + c.cal, 0) / calData.length) : 0;
  const totalMealCal = displayMeals.filter(m => m.status === 'done').reduce((s, m) => s + m.cal, 0);

  return (
    <div className="page-container">
      {/* Welcome banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #0f2a1a 0%, #162233 100%)',
        border: '1px solid rgba(111,207,151,0.12)', borderRadius: 'var(--radius-xl)',
        padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 28, flexWrap: 'wrap', gap: 20,
        boxShadow: 'inset 0 0 60px rgba(111,207,151,0.03)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--sage)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>🔥 {streak}-day streak</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--text-primary)', marginBottom: 4 }}>Good morning, {name}!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {streak > 0 ? `You're on a ${streak}-day streak. Keep it up!` : 'Start logging meals to build your streak!'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('planner')}>View Plan</button>
          <button className="btn btn-sage" onClick={() => navigate('nutrition')}>Log Meal +</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4 animate-fade-up-1" style={{ marginBottom: 24 }}>
        {[
          { label: "Today's Calories", value: `${cal}`, sub: `/ ${target} kcal`, color: 'var(--sage)', icon: '🔥', pct },
          { label: 'Protein Today', value: `${totalProt}g`, sub: '/ 120g target', color: 'var(--sky)', icon: '💪', pct: Math.min(Math.round((totalProt / 120) * 100), 100) },
          { label: 'Water Intake', value: '1.8L', sub: '/ 2.5L goal', color: 'var(--amber)', icon: '💧', pct: 72 },
          { label: 'Meals Logged', value: `${nutrition?.meal_count || 0}`, sub: `today`, color: 'var(--coral)', icon: '✅', pct: Math.min(((nutrition?.meal_count || 0) / 4) * 100, 100) },
        ].map((s, i) => (
          <div key={i} className="card card-sm" style={{ borderTop: `2px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div className="progress-track" style={{ height: 4 }}>
              <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Today's meals */}
        <div className="card animate-fade-up-2">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <div className="section-title" style={{ fontSize: '1.05rem' }}>Today's Meals</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{totalMealCal} / {target} kcal logged</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('planner')}>Edit</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {displayMeals.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
                opacity: m.status === 'pending' ? 0.6 : 1
              }}>
                <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{m.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: m.status === 'done' ? 'var(--sage)' : 'var(--text-muted)' }}>{m.cal} kcal</div>
                  <div style={{ fontSize: '0.68rem', color: m.status === 'done' ? 'var(--sage)' : 'var(--amber)' }}>{m.status === 'done' ? '✓ Done' : '⏳ Pending'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macros */}
        <div className="card animate-fade-up-2">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ fontSize: '1.05rem' }}>Macro Balance</div>
            <span className="badge badge-sage">{cal > 0 ? 'On Track' : 'No Data'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {macros.map((m, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: m.color }}>{m.val}{m.unit} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {m.max}{m.unit}</span></span>
                </div>
                <div className="progress-track" style={{ height: 7 }}>
                  <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: '14px', background: 'var(--sage-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(111,207,151,0.15)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--sage)', fontWeight: 700, marginBottom: 4 }}>💡 AI Suggestion</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {totalProt < 50 ? 'Protein is low today. Add Greek yogurt or boiled eggs to your next meal.' : 'Great macro balance today! Keep it up.'}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Calorie chart */}
        <div className="card animate-fade-up-3">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="section-title" style={{ fontSize: '1.05rem' }}>Calorie Trend</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Recent history</div>
            </div>
            <span className="badge badge-sky">Avg {avgCal} kcal</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={calData}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--sage)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--sage)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cal" stroke="var(--sage)" strokeWidth={2} fill="url(#calGrad)" dot={{ fill: 'var(--sage)', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weight chart */}
        <div className="card animate-fade-up-3">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="section-title" style={{ fontSize: '1.05rem' }}>Weight Progress</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--sage)', fontWeight: 600 }}>
                {weightProgress.weight_change ? `↓ ${weightProgress.weight_change} kg so far 🎉` : 'Start tracking to see progress'}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightData.length > 0 ? weightData : [{ day: 'W1', weight: weightProgress.current_weight || 75 }]}>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="var(--lime)" strokeWidth={2.5} dot={{ fill: 'var(--lime)', r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
