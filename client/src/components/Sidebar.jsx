import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Home, MessageSquare, BookOpen, Brain, Grid, Lightbulb,
  BarChart2, Star, FolderOpen, Settings, Plus, Trash2,
  ChevronDown, ChevronRight, Search, User, Moon, Sun,
  ChevronLeft, Shield, TrendingUp, Users, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { id: 'home',       label: 'Dashboard',          icon: <Home size={15} /> },
      { id: 'chat',       label: 'Ethics Assistant',   icon: <MessageSquare size={15} />, badge: 'HF Models' },
    ]
  },
  {
    label: 'Core Analysis Tools',
    items: [
      { id: 'council',    label: 'Ethics Council',     icon: <Users size={15} />, badge: 'Debate' },
      { id: 'frameworks', label: 'Ethical Frameworks', icon: <BookOpen size={15} /> },
      { id: 'analyzer',   label: 'Decision Analyzer',  icon: <Brain size={15} /> },
      { id: 'comparison', label: 'Compare Frameworks', icon: <TrendingUp size={15} /> },
      { id: 'cases',      label: 'Case Studies',       icon: <Grid size={15} /> },
    ]
  },
  {
    label: 'Library & Config',
    items: [
      { id: 'saved',    label: 'Saved Analyses', icon: <Star size={15} /> },
      { id: 'history',  label: 'Inquiry History',icon: <FolderOpen size={15} /> },
      { id: 'settings', label: 'Settings & Models', icon: <Settings size={15} /> },
    ]
  }
];

export default function Sidebar({
  open, collapsed, onToggleCollapse,
  sessions, activeId, onNewChat, onLoad, onDelete,
  activeView, onNavigate, darkMode, onToggleDark
}) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );
  const showLabel = !collapsed || isMobile;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          onClick={onToggleCollapse}
        />
      )}

      <aside
        className={[
          'sidebar',
          collapsed && !isMobile ? 'collapsed' : '',
          isMobile ? 'fixed left-0 top-0 shadow-xl' : '',
          isMobile && !open ? '-translate-x-full' : '',
          isMobile ? 'transition-transform duration-200' : '',
        ].join(' ')}
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        {/* Brand Header */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showLabel ? 'space-between' : 'center',
          padding: '0 16px',
          height: 52,
          borderBottom: '1px solid var(--border)',
        }}>
          {showLabel ? (
            <button
              onClick={() => onNavigate('home')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', minWidth: 0 }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'var(--accent)', color: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontWeight: 700
              }}>
                <Scale size={13} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Ethics Critic
              </span>
            </button>
          ) : (
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'var(--accent)', color: 'var(--bg-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Scale size={13} />
            </div>
          )}
          {showLabel && (
            <button
              onClick={onToggleCollapse}
              style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* New Action */}
        <div style={{ flexShrink: 0, padding: '10px 10px 4px' }}>
          <button
            onClick={() => { onNewChat(); onNavigate('chat'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: showLabel ? 'flex-start' : 'center',
              gap: 8, padding: '7px 10px', borderRadius: 6,
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.12s ease',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Plus size={14} style={{ flexShrink: 0 }} />
            {showLabel && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>New Analysis</span>}
          </button>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '6px 8px', display: 'flex', flexDirection: 'column' }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={{ marginBottom: 12 }}>
              {section.label && showLabel && (
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', padding: '6px 8px 4px' }}>
                  {section.label}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.items.map(item => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={!showLabel ? item.label : undefined}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: showLabel ? 'flex-start' : 'center',
                        gap: 10,
                        padding: showLabel ? '6px 8px' : '6px 0',
                        borderRadius: 6,
                        border: 'none',
                        background: isActive ? 'var(--bg-card)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.1s ease',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                      }}
                      onMouseOver={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--bg-card-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseOut={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>
                        {item.icon}
                      </span>
                      {showLabel && (
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>
                      )}
                      {showLabel && item.badge && (
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4, background: 'var(--accent-light)', color: 'var(--text-primary)', flexShrink: 0 }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Recent Inquiries */}
          {showLabel && (
            <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setHistoryOpen(h => !h)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}
              >
                <span>Recent Inquiries</span>
                {historyOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', margin: '4px 0 6px', borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Search size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter..."
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: 11, color: 'var(--text-primary)' }}
                />
              </div>

              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {filtered.length === 0 ? (
                      <div style={{ padding: '6px 8px', fontSize: 11, color: 'var(--text-muted)' }}>No history yet</div>
                    ) : filtered.slice(0, 5).map(s => (
                      <div
                        key={s.id}
                        onClick={() => { onLoad(s.id); onNavigate('chat'); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6,
                          cursor: 'pointer', fontSize: 11,
                          color: activeId === s.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: activeId === s.id ? 'var(--bg-card)' : 'transparent',
                          transition: 'background 0.1s'
                        }}
                        onMouseOver={e => { if (activeId !== s.id) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                        onMouseOut={e => { if (activeId !== s.id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <MessageSquare size={11} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
                        <button
                          onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                          style={{ flexShrink: 0, padding: 2, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Footer Profile & Theme Toggle */}
        <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', padding: '8px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: showLabel ? 'space-between' : 'center',
            padding: '6px 8px', borderRadius: 6,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--accent)', color: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: 11, fontWeight: 700
              }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              {showLabel && (
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.role || 'Scholar'}
                  </div>
                </div>
              )}
            </div>

            {showLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={onToggleDark}
                  style={{
                    padding: 4, borderRadius: 6, background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                  }}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                </button>
                <button
                  onClick={logout}
                  style={{
                    padding: 4, borderRadius: 6, background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                  }}
                  title="Sign Out"
                  onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>

          {!showLabel && (
            <button
              onClick={onToggleCollapse}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginTop: 4 }}
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
