import React, { useState } from 'react';
import { createProfile } from '../api';

const goals = ['Lose Weight', 'Maintain Weight', 'Gain Muscle', 'Improve Health'];
const activities = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const diets = ['No Preference', 'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Low-Carb'];
const allergies = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Shellfish'];

export default function ProfileSetup({ navigate, userData }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', age: '', height: '', weight: '',
    goal: '', activity: '', diet: '', allergies: []
  });
  const [saving, setSaving] = useState(false);

  const toggleAllergy = (a) => setForm(f => ({
    ...f, allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a]
  }));

  const next = async () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      // Save profile to backend
      setSaving(true);
      try {
        const userId = userData?.userId || 1;
        await createProfile({
          user_id: userId,
          name: form.name,
          age: parseInt(form.age) || 0,
          height: parseFloat(form.height) || 0,
          weight: parseFloat(form.weight) || 0,
          goal: form.goal,
          activity_level: form.activity,
          diet: form.diet,
          allergies: form.allergies
        });
        navigate('generating', { profile: form, name: form.name, userId });
      } catch (err) {
        console.error('Profile save error:', err);
        // Navigate anyway for demo purposes
        navigate('generating', { profile: form, name: form.name });
      } finally {
        setSaving(false);
      }
    }
  };

  const Chip = ({ label, selected, onClick }) => (
    <button onClick={onClick} style={{
      padding: '10px 18px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
      background: selected ? 'var(--sage-muted)' : 'var(--surface)',
      color: selected ? 'var(--sage)' : 'var(--text-secondary)',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.87rem',
      border: selected ? '1px solid rgba(111,207,151,0.4)' : '1px solid rgba(255,255,255,0.07)',
      transition: 'all 0.18s'
    }}>{label}</button>
  );

  const totalSteps = 3;
  const pct = (step / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ width: '100%', maxWidth: 620 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, justifyContent: 'center' }}>
          <div className="brand-logo">🌿</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>CalWise</span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Step {step} of {totalSteps}</span>
          <span style={{ color: 'var(--sage)' }}>{Math.round(pct)}% complete</span>
        </div>
        <div className="progress-track" style={{ height: 5, marginBottom: 36 }}>
          <div className="progress-fill progress-sage" style={{ width: `${pct}%` }} />
        </div>

        <div className="card" style={{ padding: 40 }}>
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 6 }}>Tell us about yourself</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 28 }}>We'll use this to calculate your ideal calorie target.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="input-label">Full Name</label>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Aarav Mehta" />
                </div>
                <div className="grid-3">
                  <div>
                    <label className="input-label">Age</label>
                    <input className="input" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="25" />
                  </div>
                  <div>
                    <label className="input-label">Height (cm)</label>
                    <input className="input" type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} placeholder="172" />
                  </div>
                  <div>
                    <label className="input-label">Weight (kg)</label>
                    <input className="input" type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="75" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 6 }}>Your goals & lifestyle</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 28 }}>Pick what best describes you right now.</p>
              <div style={{ marginBottom: 24 }}>
                <label className="input-label" style={{ marginBottom: 12 }}>Primary Goal</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {goals.map(g => <Chip key={g} label={g} selected={form.goal === g} onClick={() => setForm(f => ({ ...f, goal: g }))} />)}
                </div>
              </div>
              <div>
                <label className="input-label" style={{ marginBottom: 12 }}>Activity Level</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {activities.map(a => <Chip key={a} label={a} selected={form.activity === a} onClick={() => setForm(f => ({ ...f, activity: a }))} />)}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 6 }}>Food preferences</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 28 }}>We'll personalize recipes based on this.</p>
              <div style={{ marginBottom: 24 }}>
                <label className="input-label" style={{ marginBottom: 12 }}>Diet Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {diets.map(d => <Chip key={d} label={d} selected={form.diet === d} onClick={() => setForm(f => ({ ...f, diet: d }))} />)}
                </div>
              </div>
              <div>
                <label className="input-label" style={{ marginBottom: 12 }}>Allergies / Avoid (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {allergies.map(a => <Chip key={a} label={a} selected={form.allergies.includes(a)} onClick={() => toggleAllergy(a)} />)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
            {step > 1
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
              : <div />
            }
            <button className="btn btn-lime" onClick={next} disabled={saving}>
              {saving ? 'Saving...' : step < 3 ? 'Continue →' : 'Generate My Plan ✨'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
