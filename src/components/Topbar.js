import React from 'react';

export default function Topbar({ title, navigate, userData }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>{today}</div>
      </div>
      <div className="topbar-actions">
        <button className="notif-btn btn-icon btn">
          🔔
          <span className="notif-dot" />
        </button>
        <button className="btn btn-lime btn-sm" onClick={() => navigate('landing')}>
          Logout
        </button>
      </div>
    </header>
  );
}
