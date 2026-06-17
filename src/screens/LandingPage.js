import React, { useState, useEffect } from 'react';

const features = [
  { icon: '🤖', title: 'AI Calorie Optimization', desc: 'Smart daily targets adjusted to your metabolism and activity.' },
  { icon: '📊', title: 'Progress Analytics', desc: 'Visual charts tracking weight, macros, and streaks over time.' },
  { icon: '🍳', title: 'Recipe Explorer', desc: '500+ recipes filtered by goal, budget, and ingredients you have.' },
  { icon: '👥', title: 'Community Streaks', desc: 'Compete, inspire and stay accountable with others.' },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '12M+', label: 'Meals Logged' },
  { value: '94%', label: 'Goal Success Rate' },
  { value: '4.9★', label: 'App Rating' },
];

export default function LandingPage({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(13,17,23,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        padding: '18px 60px', display: 'flex', alignItems: 'center',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div className="brand-logo">🌿</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>CalWise</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'About', 'Pricing'].map(l => (
            <span key={l} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
            >{l}</span>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('login')}>Log in</button>
          <button className="btn btn-lime" onClick={() => navigate('login')}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '80px 24px 60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(111,207,151,0.07) 0%, transparent 70%)', top: '-100px', left: '10%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(181,245,63,0.05) 0%, transparent 70%)', bottom: '0', right: '15%', pointerEvents: 'none' }} />

        <div className="badge badge-sage animate-fade-up" style={{ marginBottom: 24 }}>
          🌿 AI-Powered Nutrition Platform
        </div>
        <h1 className="animate-fade-up-1" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
          lineHeight: 1.12, color: 'var(--text-primary)', maxWidth: 820, marginBottom: 24
        }}>
          Eat Smarter.<br />
          <span style={{ color: 'var(--sage)' }}>Reach Your Goals</span> Faster.
        </h1>
        <p className="animate-fade-up-2" style={{
          color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 40
        }}>
          CalWise creates personalized meal plans, tracks your macros, and adapts to your lifestyle — all powered by AI.
        </p>
        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 14 }}>
          <button className="btn btn-lime btn-lg" onClick={() => navigate('login')}>Start for Free →</button>
          <button className="btn btn-ghost btn-lg">Watch Demo ▶</button>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-4" style={{
          display: 'flex', gap: 48, marginTop: 72,
          padding: '24px 48px', background: 'var(--obsidian-2)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)'
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sage)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 60px', background: 'var(--obsidian-2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge badge-lime" style={{ marginBottom: 16 }}>Core Features</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--text-primary)' }}>
            Everything you need to<br />transform your health
          </h2>
        </div>
        <div className="grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} className="card card-hover" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div style={{
        margin: '80px 60px', borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #0f2a1a, #162233)',
        border: '1px solid rgba(111,207,151,0.15)',
        padding: '60px', textAlign: 'center',
        boxShadow: 'inset 0 0 80px rgba(111,207,151,0.04)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 16 }}>
          Ready to eat smarter?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>
          Join 50,000+ people who've transformed their health with CalWise.
        </p>
        <button className="btn btn-sage btn-lg" onClick={() => navigate('login')}>
          Create Free Account
        </button>
      </div>
    </div>
  );
}
