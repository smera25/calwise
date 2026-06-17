import React, { useState, useEffect } from 'react';
import { generateMealPlan } from '../api';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner({ navigate, showToast, userData }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [meals, setMeals] = useState([]);
  const [planInfo, setPlanInfo] = useState({ daily_target: 1800, deficit: '0 kcal', timeline: 'Ongoing' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if meal plan was already fetched during GeneratingPlan
    if (userData?.mealPlan) {
      setMeals(userData.mealPlan.meals || []);
      setPlanInfo({
        daily_target: userData.mealPlan.daily_target || 1800,
        deficit: userData.mealPlan.deficit || '0 kcal',
        timeline: userData.mealPlan.timeline || 'Ongoing'
      });
      setLoading(false);
    } else {
      // Fetch from backend directly
      const goal = userData?.profile?.goal || 'Maintain Weight';
      generateMealPlan(goal)
        .then(data => {
          const plan = data.meal_plan;
          setMeals(plan.meals || []);
          setPlanInfo({
            daily_target: plan.daily_target || 1800,
            deficit: plan.deficit || '0 kcal',
            timeline: plan.timeline || 'Ongoing'
          });
        })
        .catch(err => {
          console.error('Failed to fetch meal plan:', err);
          // Use fallback meals
          setMeals([
            { type: 'Breakfast', icon: '🥣', time: '7:30 AM', name: 'Oats & Egg Power Bowl', kcal: 390, ingredients: ['½ cup oats', '1 boiled egg', '1 tbsp peanut butter', 'Banana slices', 'Almond milk'], protein: 18, carbs: 45, fats: 12 },
            { type: 'Lunch', icon: '🍛', time: '1:00 PM', name: 'Grilled Chicken Rice Bowl', kcal: 540, ingredients: ['100g grilled chicken', '1 cup brown rice', 'Mixed vegetables', 'Olive oil', 'Lemon'], protein: 35, carbs: 60, fats: 14 },
            { type: 'Snack', icon: '🥛', time: '4:00 PM', name: 'Greek Yogurt + Almonds', kcal: 180, ingredients: ['150g Greek yogurt', '20g almonds', 'Honey drizzle'], protein: 14, carbs: 12, fats: 8 },
            { type: 'Dinner', icon: '🍽️', time: '7:30 PM', name: 'Paneer Veg Stir Fry', kcal: 480, ingredients: ['100g paneer', 'Bell peppers', 'Broccoli', 'Light soy sauce', '1 multigrain roti'], protein: 28, carbs: 35, fats: 18 },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const totalKcal = meals.reduce((s, m) => s + m.kcal, 0);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading meal plan...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Plan summary bar */}
      <div className="animate-fade-up" style={{
        background: 'var(--obsidian-2)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-lg)', padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        marginBottom: 28
      }}>
        <div style={{ display: 'flex', gap: 36 }}>
          {[['🎯 Daily Target', `${planInfo.daily_target} kcal`], ['📉 Deficit', planInfo.deficit], ['📅 Timeline', planInfo.timeline]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm">Modify Preferences</button>
          <button className="btn btn-lime btn-sm" onClick={() => showToast && showToast('Plan saved!', '💾')}>Save Plan</button>
        </div>
      </div>

      {/* Day selector */}
      <div className="animate-fade-up-1" style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setDayIdx(i)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
            background: dayIdx === i ? 'var(--sage-muted)' : 'var(--surface)',
            color: dayIdx === i ? 'var(--sage)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.82rem',
            border: dayIdx === i ? '1px solid rgba(111,207,151,0.3)' : '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.18s'
          }}>
            <div>{d}</div>
            <div style={{ fontSize: '0.65rem', marginTop: 3, color: 'var(--text-muted)' }}>{totalKcal + (i * 40 - 120)} cal</div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          {fullDays[dayIdx]}
          <span style={{ fontSize: '0.9rem', color: 'var(--sage)', fontFamily: 'var(--font-body)', fontWeight: 600, marginLeft: 12 }}>{totalKcal} kcal total</span>
        </h3>
      </div>

      {/* Meal cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {meals.map((meal, i) => (
          <div key={i} className="card animate-fade-up-2" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>{meal.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{meal.type}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {meal.time}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{meal.name}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--lime-dark)' }}>{meal.kcal}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>kcal</div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 4 }}>{expanded === i ? '▲' : '▼'}</div>
            </div>

            {expanded === i && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Ingredients</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {(meal.ingredients || []).map((ing, j) => (
                      <li key={j} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--sage)', flexShrink: 0, display: 'inline-block' }} />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Nutrition</div>
                  {[['Protein', meal.protein, 'g', 'var(--sage)'], ['Carbs', meal.carbs, 'g', 'var(--sky)'], ['Fats', meal.fats, 'g', 'var(--amber)']].map(([l, v, u, c]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: 50 }}>{l}</span>
                      <div className="progress-track" style={{ flex: 1, height: 5 }}>
                        <div className="progress-fill" style={{ width: `${Math.min(v * 2, 100)}%`, background: c }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: c, width: 36, textAlign: 'right' }}>{v}{u}</span>
                    </div>
                  ))}
                </div>
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost btn-sm">🔄 Swap Meal</button>
                  <button className="btn btn-ghost btn-sm">📋 View Recipe</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
        <button className="btn btn-lime" onClick={() => navigate('dashboard')}>Start Tracking →</button>
      </div>
    </div>
  );
}
