import React, { useState, useEffect } from 'react';
import { getRecipes } from '../api';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
const dietFilters = ['All Diets', 'Veg', 'Non-Veg', 'Vegan'];
const tagFilters = ['High Protein', 'Low Cal', 'Quick', 'Indian', 'Budget-Friendly'];

export default function RecipeExplorer({ showToast }) {
  const [recipes, setRecipes] = useState([]);
  const [cat, setCat] = useState('All');
  const [diet, setDiet] = useState('All Diets');
  const [activeTags, setActiveTags] = useState([]);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState([2, 4, 8]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from backend
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = t => setActiveTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);
  const toggleSave = (id) => {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    showToast && showToast(saved.includes(id) ? 'Recipe removed' : 'Recipe saved!', saved.includes(id) ? '🗑️' : '❤️');
  };

  // Client-side filtering (recipes already loaded from backend)
  const filtered = recipes.filter(r => {
    if (cat !== 'All' && r.tag !== cat) return false;
    if (diet !== 'All Diets' && r.diet !== diet) return false;
    if (activeTags.length && !activeTags.every(t => r.tags.includes(t))) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Search & filters */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <input className="input" placeholder="🔍 Search recipes by name or ingredient..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className="btn btn-sm" style={{
              background: cat === c ? 'var(--sage)' : 'var(--surface)',
              color: cat === c ? 'var(--obsidian)' : 'var(--text-secondary)',
              border: cat === c ? 'none' : '1px solid rgba(255,255,255,0.07)',
              fontWeight: cat === c ? 700 : 500
            }}>{c}</button>
          ))}
          <div style={{ height: 1, width: '100%' }} />
          {dietFilters.map(d => (
            <button key={d} onClick={() => setDiet(d)} className="btn btn-sm" style={{
              background: diet === d ? 'var(--lime-muted)' : 'var(--surface)',
              color: diet === d ? 'var(--lime-dark)' : 'var(--text-secondary)',
              border: diet === d ? '1px solid rgba(181,245,63,0.3)' : '1px solid rgba(255,255,255,0.07)',
              fontWeight: diet === d ? 700 : 500
            }}>{d}</button>
          ))}
          {tagFilters.map(t => (
            <button key={t} onClick={() => toggleTag(t)} className="btn btn-sm" style={{
              background: activeTags.includes(t) ? 'var(--amber-muted)' : 'var(--surface)',
              color: activeTags.includes(t) ? 'var(--amber)' : 'var(--text-muted)',
              border: activeTags.includes(t) ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(255,255,255,0.07)',
              fontWeight: activeTags.includes(t) ? 700 : 500
            }}>#{t}</button>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filtered.length} recipes found</div>
      </div>

      {/* Recipe grid */}
      <div className="grid-3 animate-fade-up-1">
        {filtered.map((r, i) => (
          <div key={r.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem'
              }}>{r.icon}</div>
              <button onClick={() => toggleSave(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {saved.includes(r.id) ? '❤️' : '🤍'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>{r.tag}</span>
              <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>⏱ {r.time}m</span>
              <span className="badge" style={{ background: 'var(--lime-muted)', color: 'var(--lime-dark)', fontSize: '0.65rem' }}>{r.diet}</span>
            </div>

            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{r.name}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {r.tags.map(t => (
                <span key={t} style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>#{t}</span>
              ))}
            </div>

            {/* Macros mini-bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, marginTop: 'auto' }}>
              {[['🔥', r.cal, 'kcal', 'var(--lime-dark)'], ['💪', r.protein+'g', 'P', 'var(--sage)'], ['🌾', r.carbs+'g', 'C', 'var(--sky)'], ['💛', r.fats+'g', 'F', 'var(--amber)']].map(([icon, val, label, color]) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-xs)', padding: '6px 4px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>View Recipe</button>
              <button className="btn btn-sage btn-sm" style={{ flex: 1 }}>Add to Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
