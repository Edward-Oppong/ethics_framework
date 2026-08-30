import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Trash2, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export default function HistoryView({ sessions, onLoad, onDelete, onNavigate }) {
  const [search, setSearch] = useState('');
  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

          <div>
            <h1 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>Inquiry History</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              Browse and manage your past ethical analyses and council debates.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search past inquiries and analyses..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }}
            />
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              {sessions.length === 0 ? 'No inquiry history yet. Start your first ethical analysis.' : 'No matching inquiries found.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {filtered.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-interactive"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px', borderRadius: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => { onLoad(s.id); onNavigate('chat'); }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageSquare size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                          {new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>·</span>
                        <span className="badge-framework">{s.messages?.length || 0} Deliberation Steps</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                        style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.15s ease' }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Delete session"
                      >
                        <Trash2 size={15} />
                      </button>
                      <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
