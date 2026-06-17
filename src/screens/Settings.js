import React, { useState } from 'react';

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{
    width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
    background: value ? 'var(--sage)' : 'var(--surface-2)',
    position: 'relative', transition: 'background 0.25s', flexShrink: 0
  }}>
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: 'white',
      position: 'absolute', top: 3, left: value ? 21 : 3,
      transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
    }} />
  </div>
);

const Section = ({ title, children }) => (
  <div className="card" style={{ marginBottom: 20 }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, sub, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

export default function Settings({ navigate, userData, showToast }) {
  const [notifs, setNotifs] = useState({ mealReminders: true, streakAlerts: true, weeklyReport: false, communityUpdates: true });
  const [prefs, setPrefs] = useState({ units: 'metric', theme: 'dark', language: 'English' });
  const [goal, setGoal] = useState({ target: '72', weekly: '0.5', calories: '1800' });
  const rawName = userData?.name || userData?.profile?.name || 'Aarav';
  const name = rawName.trim() === '' ? 'Aarav' : rawName.split(' ')[0];

  const save = () => showToast && showToast('Settings saved!', '✅');

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      {/* Profile section */}
      <Section title="👤 Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sage-dark), var(--lime-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', color: 'var(--obsidian)' }}>
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--sage)', fontWeight: 600 }}>Pro Plan · Member since Jan 2025</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>aarav@example.com</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Edit</button>
        </div>
        <div className="grid-3" style={{ gap: 12 }}>
          {[['Current Weight', '73.6 kg'], ['Goal Weight', '70 kg'], ['Height', '172 cm']].map(([l, v]) => (
            <div key={l} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Goals */}
      <Section title="🎯 Goals & Targets">
        <Row label="Goal Weight" sub="Your target body weight">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input className="input" value={goal.target} onChange={e => setGoal(g => ({ ...g, target: e.target.value }))} style={{ width: 80, textAlign: 'right' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>kg</span>
          </div>
        </Row>
        <Row label="Weekly Loss Goal" sub="Recommended: 0.3–0.7 kg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input className="input" value={goal.weekly} onChange={e => setGoal(g => ({ ...g, weekly: e.target.value }))} style={{ width: 80, textAlign: 'right' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>kg/wk</span>
          </div>
        </Row>
        <Row label="Daily Calorie Target" sub="Auto-calculated from your profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input className="input" value={goal.calories} onChange={e => setGoal(g => ({ ...g, calories: e.target.value }))} style={{ width: 90, textAlign: 'right' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>kcal</span>
          </div>
        </Row>
        <Row label="Diet Type" sub="Affects meal plan curation">
          <select className="select" style={{ width: 160 }}>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
            <option>No Preference</option>
          </select>
        </Row>
      </Section>

      {/* Notifications */}
      <Section title="🔔 Notifications">
        {[
          ['mealReminders', 'Meal Reminders', 'Get notified 15 min before each meal'],
          ['streakAlerts', 'Streak Alerts', 'Daily reminder to maintain your streak'],
          ['weeklyReport', 'Weekly Report', 'Receive a summary every Monday morning'],
          ['communityUpdates', 'Community Updates', 'Likes and comments on your posts'],
        ].map(([key, label, sub]) => (
          <Row key={key} label={label} sub={sub}>
            <Toggle value={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
          </Row>
        ))}
      </Section>

      {/* Preferences */}
      <Section title="⚙️ App Preferences">
        <Row label="Units" sub="Weight and measurement units">
          <div style={{ display: 'flex', gap: 6 }}>
            {['metric', 'imperial'].map(u => (
              <button key={u} onClick={() => setPrefs(p => ({ ...p, units: u }))} className="btn btn-sm" style={{
                background: prefs.units === u ? 'var(--sage-muted)' : 'var(--surface)',
                color: prefs.units === u ? 'var(--sage)' : 'var(--text-muted)',
                border: prefs.units === u ? '1px solid rgba(111,207,151,0.3)' : '1px solid rgba(255,255,255,0.07)',
                textTransform: 'capitalize'
              }}>{u}</button>
            ))}
          </div>
        </Row>
        <Row label="Language" sub="App display language">
          <select className="select" style={{ width: 140 }}>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </Row>
      </Section>

      {/* Danger zone */}
      <Section title="⚠️ Account">
        <Row label="Export My Data" sub="Download all your logs as CSV">
          <button className="btn btn-ghost btn-sm">Export</button>
        </Row>
        <Row label="Reset Progress" sub="Clear all meal logs and weight data">
          <button className="btn btn-danger btn-sm">Reset</button>
        </Row>
        <Row label="Delete Account" sub="Permanently delete your account">
          <button className="btn btn-danger btn-sm" onClick={() => navigate('landing')}>Delete</button>
        </Row>
      </Section>

      <button className="btn btn-lime btn-lg" onClick={save} style={{ width: '100%', marginBottom: 40 }}>
        Save All Changes
      </button>
    </div>
  );
}
