import React, { useState } from 'react';
import { registerUser, loginUser } from '../api';

const testimonials = [
  { text: "Lost 8kg in 2 months. The meal plans are chef's kiss!", name: 'Priya S.', handle: '@priya_fit' },
  { text: "Finally an app that understands Indian cuisine 🙌", name: 'Rohan M.', handle: '@rohan_healthy' },
  { text: "The progress charts keep me so motivated every morning.", name: 'Sneha K.', handle: '@sneha_eats' },
];

export default function LoginSignup({ navigate }) {
  const [mode, setMode]   = useState('signup');
  const [form, setForm]   = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tIdx, setTIdx]   = useState(0);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    if (mode === 'signup' && form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'signup') {
        // Call backend register API
        result = await registerUser(form.email, form.password);
      } else {
        // Call backend login API
        result = await loginUser(form.email, form.password);
      }
      // Store user info and navigate to profile setup
      navigate('profile', { userId: result.user.id, email: result.user.email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
            <div className="brand-logo">🌿</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>CalWise</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 16 }}>
            Your personal<br /><span style={{ color: 'var(--sage)' }}>nutrition coach</span><br />awaits.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 380, marginBottom: 56 }}>
            Build lasting healthy habits with AI-driven meal plans tailored to your body, goals, and taste.
          </p>

          {/* Testimonial */}
          <div style={{ background: 'rgba(111,207,151,0.07)', border: '1px solid rgba(111,207,151,0.15)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', maxWidth: 400 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>
              "{testimonials[tIdx].text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sage-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--obsidian)' }}>
                {testimonials[tIdx].name[0]}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{testimonials[tIdx].name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--sage)' }}>{testimonials[tIdx].handle}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTIdx(i)} style={{
                  width: i === tIdx ? 20 : 6, height: 6, borderRadius: 3,
                  background: i === tIdx ? 'var(--sage)' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 6 }}>
          {mode === 'signup' ? 'Create account' : 'Welcome back'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 32 }}>
          {mode === 'signup' ? 'Start your 14-day free trial. No credit card.' : 'Log in to continue your journey.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="input-label">Email address</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 8 characters" />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="input-label">Confirm password</label>
              <input className="input" name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="Repeat password" />
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--coral-muted)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--coral)' }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn btn-lime" onClick={submit} style={{ width: '100%', marginTop: 24, padding: '14px', fontSize: '0.95rem' }}>
          {loading ? '...' : mode === 'signup' ? 'Create Account →' : 'Log In →'}
        </button>

        {mode === 'signup' && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12 }}>
            By signing up, you agree to our Terms & Privacy Policy.
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => { setMode(m => m === 'signup' ? 'login' : 'signup'); setError(''); }}
            style={{ color: 'var(--sage)', fontWeight: 700, cursor: 'pointer' }}>
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </span>
        </div>
      </div>
    </div>
  );
}
