import React, { useEffect, useState } from 'react';
import { generateMealPlan } from '../api';

const steps = [
  { label: 'Analyzing your body metrics', detail: 'BMR & TDEE calculation' },
  { label: 'Setting calorie targets', detail: 'Based on your goal & activity' },
  { label: 'Curating meal combinations', detail: 'Matching your diet preference' },
  { label: 'Optimizing macro distribution', detail: 'Protein, carbs & fats balance' },
  { label: 'Building your 7-day plan', detail: 'Variety & nutrient completeness' },
];

export default function GeneratingPlan({ navigate, userData }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch meal plan from backend in the background
    const goal = userData?.profile?.goal || 'Maintain Weight';
    generateMealPlan(goal)
      .then(data => {
        // Store the meal plan in userData for MealPlanner to use
        userData.mealPlan = data.meal_plan;
      })
      .catch(err => console.error('Meal plan generation failed:', err));

    const tick = setInterval(() => {
      setCurrent(c => {
        if (c >= steps.length - 1) {
          clearInterval(tick);
          setTimeout(() => navigate('planner'), 700);
          return c;
        }
        return c + 1;
      });
    }, 900);

    const prog = setInterval(() => {
      setProgress(p => {
        return Math.min(p + 2, 98);
      });
    }, 40);

    return () => { clearInterval(tick); clearInterval(prog); };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: 'var(--obsidian)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>
        {/* Animated logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--sage), var(--lime))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 32px',
          boxShadow: 'var(--shadow-sage)', animation: 'pulse 2s ease-in-out infinite'
        }}>🌿</div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 8 }}>
          Crafting your plan
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>
          Our AI is analyzing your data and building a personalized nutrition plan.
        </p>

        {/* Progress bar */}
        <div className="progress-track" style={{ height: 8, marginBottom: 8, borderRadius: 'var(--radius-full)' }}>
          <div className="progress-fill progress-sage" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 36, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Analyzing...</span>
          <span style={{ color: 'var(--sage)', fontWeight: 600 }}>{Math.round(progress)}%</span>
        </div>

        {/* Steps */}
        <div className="card" style={{ textAlign: 'left' }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              opacity: i > current ? 0.3 : 1, transition: 'opacity 0.4s'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                background: i < current ? 'var(--sage-muted)' : i === current ? 'var(--sage)' : 'var(--surface)',
                color: i < current ? 'var(--sage)' : i === current ? 'var(--obsidian)' : 'var(--text-muted)',
                fontWeight: 700, transition: 'all 0.3s',
                animation: i === current ? 'pulse 1.2s ease-in-out infinite' : 'none'
              }}>
                {i < current ? '✓' : i + 1}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: i <= current ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 1 }}>{s.detail}</div>
              </div>
              {i === current && (
                <div style={{ marginLeft: 'auto', width: 16, height: 16, border: '2px solid var(--sage)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
