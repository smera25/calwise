import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { logMeal, getDailyNutrition } from '../api';

const quickAdd = [
  { name: 'Banana', cal: 89, icon: '🍌' },
  { name: 'Boiled Egg', cal: 78, icon: '🥚' },
  { name: 'Almonds (30g)', cal: 173, icon: '🥜' },
  { name: 'Greek Yogurt', cal: 100, icon: '🥛' },
  { name: 'Brown Rice (cup)', cal: 215, icon: '🍚' },
  { name: 'Chicken Breast', cal: 165, icon: '🍗' },
];

export default function NutritionTracker({ showToast, userData }) {
  const userId = userData?.userId || 1;
  const [log, setLog] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [custom, setCustom] = useState({ name: '', cal: '', protein: '', carbs: '', fats: '' });
  const [calTarget, setCalTarget] = useState(1800);
  const [loading, setLoading] = useState(true);

  // Fetch daily nutrition from backend on mount
  useEffect(() => {
    fetchDailyNutrition();
  }, []);

  const fetchDailyNutrition = async () => {
    try {
      const data = await getDailyNutrition(userId);
      setCalTarget(data.calorie_target || 1800);
      // Map backend meals to frontend log format
      const meals = (data.meals || []).map(m => ({
        name: m.food_name,
        cal: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fats: m.fats,
        time: m.time || '',
        icon: '🍴',
        id: m.id
      }));
      setLog(meals);
    } catch (err) {
      console.error('Failed to fetch nutrition:', err);
      // Use empty log if backend not reachable
      setLog([]);
    } finally {
      setLoading(false);
    }
  };

  const totalCal  = log.reduce((s, i) => s + i.cal, 0);
  const totalProt = log.reduce((s, i) => s + i.protein, 0);
  const totalCarb = log.reduce((s, i) => s + i.carbs, 0);
  const totalFat  = log.reduce((s, i) => s + i.fats, 0);
  const remaining = calTarget - totalCal;

  const macroData = [
    { name: 'Protein', value: totalProt, color: '#6fcf97' },
    { name: 'Carbs', value: totalCarb, color: '#56ccf2' },
    { name: 'Fats', value: totalFat, color: '#f5a623' },
  ];

  const addQuick = async (item) => {
    const mealData = {
      user_id: userId,
      food_name: item.name,
      calories: item.cal,
      protein: 2,
      carbs: 12,
      fats: 1,
      meal_type: 'Snack',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      // Log to backend
      const result = await logMeal(mealData);
      // Add to local state
      setLog(l => [...l, {
        name: item.name,
        cal: item.cal,
        protein: 2, carbs: 12, fats: 1,
        time: mealData.time,
        icon: item.icon,
        id: result.meal.id
      }]);
      showToast && showToast(`${item.name} added!`, '✅');
    } catch (err) {
      console.error('Failed to log meal:', err);
      showToast && showToast('Failed to log meal', '❌');
    }
  };

  const addCustom = async () => {
    if (!custom.name || !custom.cal) return;
    const mealData = {
      user_id: userId,
      food_name: custom.name,
      calories: +custom.cal,
      protein: +custom.protein || 0,
      carbs: +custom.carbs || 0,
      fats: +custom.fats || 0,
      meal_type: 'Other',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const result = await logMeal(mealData);
      setLog(l => [...l, {
        name: custom.name, cal: +custom.cal,
        protein: +custom.protein || 0, carbs: +custom.carbs || 0, fats: +custom.fats || 0,
        time: mealData.time, icon: '🍴', id: result.meal.id
      }]);
      setShowModal(false);
      setCustom({ name: '', cal: '', protein: '', carbs: '', fats: '' });
      showToast && showToast('Food logged!', '✅');
    } catch (err) {
      console.error('Failed to log custom meal:', err);
      showToast && showToast('Failed to log meal', '❌');
    }
  };

  const filtered = quickAdd.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading nutrition data...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Top row */}
      <div className="grid-4 animate-fade-up" style={{ marginBottom: 24 }}>
        {[
          { label: 'Calories', value: totalCal, max: calTarget, color: '#6fcf97', unit: 'kcal' },
          { label: 'Protein', value: totalProt, max: 120, color: '#56ccf2', unit: 'g' },
          { label: 'Carbs', value: totalCarb, max: 225, color: '#f5a623', unit: 'g' },
          { label: 'Fats', value: totalFat, max: 60, color: '#ff6b6b', unit: 'g' },
        ].map((s, i) => (
          <div key={i} className="card card-sm">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> {s.unit}</span></div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>/ {s.max}{s.unit}</div>
            <div className="progress-track" style={{ height: 5 }}>
              <div className="progress-fill" style={{ width: `${Math.min((s.value / s.max) * 100, 100)}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's log */}
          <div className="card animate-fade-up-1">
            <div className="section-header">
              <div>
                <div className="section-title" style={{ fontSize: '1.05rem' }}>Today's Log</div>
                <div style={{ fontSize: '0.78rem', color: remaining > 0 ? 'var(--sage)' : 'var(--coral)', fontWeight: 600 }}>
                  {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over budget`}
                </div>
              </div>
              <button className="btn btn-lime btn-sm" onClick={() => setShowModal(true)}>+ Add Food</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {log.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No meals logged yet. Use Quick Add or log a custom food!
                </div>
              )}
              {log.map((item, i) => (
                <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>P:{item.protein}g · C:{item.carbs}g · F:{item.fats}g · {item.time}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.cal}</div>
                  <button onClick={() => setLog(l => l.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', padding: 4 }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick add */}
          <div className="card animate-fade-up-2">
            <div className="section-title" style={{ fontSize: '1.05rem', marginBottom: 14 }}>Quick Add</div>
            <input className="input" placeholder="🔍 Search food..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {filtered.map((item, i) => (
                <button key={i} onClick={() => addQuick(item)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.18s',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)'
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(111,207,151,0.3)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--sage)' }}>{item.cal} kcal</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right col - macro ring */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card animate-fade-up-1">
            <div className="section-title" style={{ fontSize: '1.05rem', marginBottom: 4 }}>Macro Breakdown</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>Today's distribution</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {macroData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}g`, n]} contentStyle={{ background: 'var(--obsidian-3)', border: 'none', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {macroData.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: m.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}g</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="card animate-fade-up-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-title" style={{ fontSize: '1.05rem' }}>💧 Hydration</div>
              <span className="badge badge-sky">1.8 / 2.5L</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 48, borderRadius: 6,
                  background: i < 5 ? 'var(--sky)' : 'var(--surface)',
                  opacity: i < 5 ? (i === 4 ? 0.5 : 1) : 0.5,
                  transition: 'all 0.2s', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                }}>
                  {i < 5 ? '💧' : ''}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Each glass = 300ml · Tap to log</div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Log Custom Food</div>
            <div className="modal-subtitle">Enter the nutritional info manually.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Food Name', 'name', 'text', 'e.g. Dal Tadka'], ['Calories (kcal)', 'cal', 'number', '0'], ['Protein (g)', 'protein', 'number', '0'], ['Carbs (g)', 'carbs', 'number', '0'], ['Fats (g)', 'fats', 'number', '0']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <input className="input" type={type} placeholder={ph} value={custom[key]} onChange={e => setCustom(c => ({ ...c, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-lime" style={{ flex: 1 }} onClick={addCustom}>Log Food</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
