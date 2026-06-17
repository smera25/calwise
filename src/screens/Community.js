import React, { useState, useEffect } from 'react';
import { getCommunityPosts, createPost } from '../api';

const leaderboard = [
  { rank: 1, name: 'Priya S.', streak: 42, loss: '6.2 kg', avatar: 'PS', badge: '👑' },
  { rank: 2, name: 'Rohit M.', streak: 38, loss: '5.8 kg', avatar: 'RM', badge: '🥈' },
  { rank: 3, name: 'Sneha K.', streak: 31, loss: '4.9 kg', avatar: 'SK', badge: '🥉' },
  { rank: 4, name: 'Aarav (You)', streak: 8, loss: '2.4 kg', avatar: 'AV', badge: null, isMe: true },
  { rank: 5, name: 'Kavya R.', streak: 7, loss: '1.8 kg', avatar: 'KR', badge: null },
  { rank: 6, name: 'Arjun D.', streak: 5, loss: '1.2 kg', avatar: 'AD', badge: null },
];

const challenges = [
  { title: '7-Day Streak', icon: '🔥', participants: 234, reward: '+50 pts', joined: true, progress: 3, total: 7 },
  { title: 'No Sugar Week', icon: '🍬', participants: 178, reward: '+75 pts', joined: false, progress: 0, total: 7 },
  { title: 'Protein Goal x5', icon: '💪', participants: 312, reward: '+40 pts', joined: true, progress: 4, total: 5 },
];

export default function Community({ showToast, userData }) {
  const userId = userData?.userId || 1;
  const userName = userData?.name || 'Aarav';
  const [feed, setFeed] = useState([]);
  const [liked, setLiked] = useState([]);
  const [joined, setJoined] = useState([0, 2]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', post_type: 'tip' });

  // Fetch community posts from backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getCommunityPosts();
      setFeed(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;
    try {
      const result = await createPost({
        user_id: userId,
        username: userName,
        avatar: userName.substring(0, 2).toUpperCase(),
        content: newPost.content,
        post_type: newPost.post_type
      });
      // Add new post to the top of feed
      setFeed(f => [result.post, ...f]);
      setNewPost({ content: '', post_type: 'tip' });
      setShowPostModal(false);
      showToast && showToast('Post published!', '✅');
    } catch (err) {
      console.error('Failed to create post:', err);
      showToast && showToast('Failed to post', '❌');
    }
  };

  const toggleLike = (i) => setLiked(l => l.includes(i) ? l.filter(x => x !== i) : [...l, i]);
  const toggleJoin = (i) => {
    setJoined(j => j.includes(i) ? j.filter(x => x !== i) : [...j, i]);
    showToast && showToast(joined.includes(i) ? 'Left challenge' : 'Challenge joined! 💪', joined.includes(i) ? '👋' : '🔥');
  };

  const typeColor = { milestone: 'var(--lime-dark)', meal: 'var(--sage)', tip: 'var(--amber)' };
  const typeLabel = { milestone: '🏆 Milestone', meal: '🍽️ Meal Log', tip: '💡 Tip' };

  // Calculate time ago from created_at
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading community...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* My stats */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #0f2a1a, #162233)',
        border: '1px solid rgba(111,207,151,0.12)', borderRadius: 'var(--radius-xl)',
        padding: '24px 28px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sage-dark), var(--lime-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'var(--obsidian)' }}>
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{userName} (You)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--sage)' }}>Rank #4 this week</div>
          </div>
        </div>
        {[['🔥', '8 days', 'Current Streak'], ['⭐', '420 pts', 'Total Points'], ['🏆', '3', 'Challenges']].map(([icon, val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{icon} {label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{val}</div>
          </div>
        ))}
        <button className="btn btn-lime btn-sm" onClick={() => setShowPostModal(true)} style={{ marginLeft: 'auto' }}>+ New Post</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Feed */}
        <div>
          <div className="section-header animate-fade-up-1" style={{ marginBottom: 16 }}>
            <div className="section-title">Community Feed</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {feed.map((post, i) => (
              <div key={post.id || i} className="card animate-fade-up-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--sage)', flexShrink: 0 }}>{post.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{post.username}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(post.created_at)}</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: typeColor[post.post_type] || 'var(--amber)', background: `${typeColor[post.post_type] || 'var(--amber)'}18`, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>{typeLabel[post.post_type] || '💡 Tip'}</span>
                </div>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{post.content}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={() => toggleLike(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked.includes(i) ? 'var(--coral)' : 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 600, transition: 'color 0.2s' }}>
                    {liked.includes(i) ? '❤️' : '🤍'} {post.likes + (liked.includes(i) ? 1 : 0)}
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    💬 {post.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Leaderboard */}
          <div className="card animate-fade-up-1">
            <div className="section-title" style={{ marginBottom: 4 }}>🏆 Weekly Leaderboard</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>Ranked by streak & weight lost</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {leaderboard.map((u, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)', background: u.isMe ? 'var(--sage-muted)' : 'var(--surface)',
                  border: u.isMe ? '1px solid rgba(111,207,151,0.2)' : '1px solid transparent'
                }}>
                  <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center' }}>{u.badge || `#${u.rank}`}</span>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.isMe ? 'var(--sage)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: u.isMe ? 'var(--obsidian)' : 'var(--text-secondary)', flexShrink: 0 }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: u.isMe ? 700 : 600, color: u.isMe ? 'var(--sage)' : 'var(--text-primary)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🔥 {u.streak}d · {u.loss}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="card animate-fade-up-2">
            <div className="section-title" style={{ marginBottom: 16 }}>Active Challenges</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {challenges.map((c, i) => (
                <div key={i} style={{ padding: '14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.title}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{c.participants} participants · {c.reward}</div>
                      </div>
                    </div>
                    <button className={`btn btn-sm ${joined.includes(i) ? 'btn-ghost' : 'btn-lime'}`} onClick={() => toggleJoin(i)} style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
                      {joined.includes(i) ? 'Joined ✓' : 'Join'}
                    </button>
                  </div>
                  {joined.includes(i) && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{c.progress}/{c.total} complete</div>
                      <div className="progress-track" style={{ height: 4 }}>
                        <div className="progress-fill progress-lime" style={{ width: `${(c.progress / c.total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create a Post</div>
            <div className="modal-subtitle">Share your progress or tips with the community.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label">Post Type</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {['tip', 'milestone', 'meal'].map(t => (
                    <button key={t} onClick={() => setNewPost(p => ({ ...p, post_type: t }))} className="btn btn-sm" style={{
                      background: newPost.post_type === t ? 'var(--sage-muted)' : 'var(--surface)',
                      color: newPost.post_type === t ? 'var(--sage)' : 'var(--text-secondary)',
                      border: newPost.post_type === t ? '1px solid rgba(111,207,151,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      textTransform: 'capitalize'
                    }}>{typeLabel[t]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">What's on your mind?</label>
                <textarea className="input" rows={4} value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="Share your progress, tips, or a meal you loved..." style={{ resize: 'vertical', minHeight: 100 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowPostModal(false)}>Cancel</button>
              <button className="btn btn-lime" style={{ flex: 1 }} onClick={handleCreatePost}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
