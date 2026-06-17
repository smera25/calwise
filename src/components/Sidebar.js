import React from 'react';

const navItems = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
  { id: 'planner',   icon: '📋', label: 'Meal Planner' },
  { id: 'nutrition', icon: '🥦', label: 'Nutrition Tracker' },
  { id: 'recipes',   icon: '🍳', label: 'Recipe Explorer' },
];

const insightItems = [
  { id: 'progress',  icon: '📈', label: 'Progress Analytics' },
  { id: 'community', icon: '👥', label: 'Community', badge: '3' },
];

const accountItems = [
  { id: 'settings',  icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ screen, navigate, userData }) {
  const rawName = userData?.name || userData?.profile?.name || 'User';
  const name = rawName.trim() === '' ? 'User' : rawName.split(' ')[0];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const NavGroup = ({ items }) => items.map(item => (
    <button
      key={item.id}
      className={`nav-item ${screen === item.id ? 'active' : ''}`}
      onClick={() => navigate(item.id)}
    >
      <span className="nav-icon">{item.icon}</span>
      <span>{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </button>
  ));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">🌿</div>
        <div>
          <div className="brand-name">CalWise</div>
          <div className="brand-tag">Eat Smart</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        <NavGroup items={navItems} />

        <div className="nav-section-label">Insights</div>
        <NavGroup items={insightItems} />

        <div className="nav-section-label">Account</div>
        <NavGroup items={accountItems} />
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip" onClick={() => navigate('settings')}>
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-plan">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
