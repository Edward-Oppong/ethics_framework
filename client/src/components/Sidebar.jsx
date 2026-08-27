import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, MessageSquare, BookOpen, Brain,
  TrendingUp, Grid, Star, FolderOpen, Settings,
  Plus, Trash2, ChevronDown, ChevronRight, Search,
  Moon, Sun, ChevronLeft, Users, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { id: 'home', label: 'Dashboard',        icon: Home },
      { id: 'chat', label: 'Ethics Assistant', icon: MessageSquare },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { id: 'council',    label: 'Ethics Council',     icon: Users },
      { id: 'frameworks', label: 'Frameworks',         icon: BookOpen },
      { id: 'analyzer',   label: 'Decision Analyzer',  icon: Brain },
      { id: 'comparison', label: 'Compare',            icon: TrendingUp },
      { id: 'cases',      label: 'Case Studies',       icon: Grid },
    ],
  },
  {
    label: 'Library',
    items: [
      { id: 'saved',    label: 'Saved Analyses', icon: Star },
      { id: 'history',  label: 'History',        icon: FolderOpen },
      { id: 'settings', label: 'Settings',       icon: Settings },
    ],
  },
];

export default function Sidebar({
  open, collapsed, onToggleCollapse,
  sessions, activeId, onNewChat, onLoad, onDelete,
  activeView, onNavigate, darkMode, onToggleDark,
}) {
  const { user, logout } = useAuth();
  const [search, setSearch]         = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [isMobile, setIsMobile]     = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered  = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );
  const showLabel = !collapsed || isMobile;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div
          onClick={onToggleCollapse}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }}
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
        {/* ── Brand Header ── */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showLabel ? 'space-between' : 'center',
          padding: '0 12px',
          height: 48,
          borderBottom: '1px solid var(--border)',
        }}>
          {showLabel ? (
            <button
              onClick={() => onNavigate('home')}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: 'none', border: 'none', cursor: 'pointer', minWidth: 0,
              }}
            >
              {/* Gradient icon mark */}
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3"/><circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <span style={{
                fontSize: 13.5, fontWeight: 800, letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                Ethics Critic
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              title="Dashboard"
            >
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3"/><circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
            </button>
          )}

          {showLabel && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              style={{
                padding: 4, borderRadius: 6, background: 'none',
                border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', flexShrink: 0,
                display: 'flex', alignItems: 'center',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* ── New Analysis Button ── */}
        <div style={{ flexShrink: 0, padding: '10px 10px 4px' }}>
          <button
            onClick={() => { onNewChat(); onNavigate('chat'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: showLabel ? 'flex-start' : 'center',
              gap: 8, padding: '7px 10px', borderRadius: 7,
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.12s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--indigo)';
              e.currentTarget.style.boxShadow = 'var(--glow)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <Plus size={14} style={{ flexShrink: 0 }} />
            {showLabel && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>New Analysis</span>}
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav style={{
          flex: '1 1 0%', minHeight: 0,
          overflowY: 'auto', overflowX: 'hidden',
          padding: '4px 8px', display: 'flex', flexDirection: 'column',
        }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={{ marginBottom: 10 }}>
              {section.label && showLabel && (
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
                  padding: '8px 8px 3px', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  {section.label}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.items.map(item => {
                  const isActive = activeView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={!showLabel ? item.label : undefined}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: showLabel ? 'flex-start' : 'center',
                        gap: 9, padding: showLabel ? '6px 8px' : '6px 0',
                        borderRadius: 7, border: 'none',
                        background: isActive ? 'var(--bg-card)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: 12.5, fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.1s ease',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                        /* Linear-style left accent */
                        borderLeft: isActive ? '2px solid var(--indigo)' : '2px solid transparent',
                        paddingLeft: showLabel ? (isActive ? '6px' : '8px') : undefined,
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
                      <span style={{
                        color: isActive ? 'var(--indigo)' : 'var(--text-muted)',
                        flexShrink: 0, display: 'flex',
                      }}>
                        <Icon size={14} />
                      </span>
                      {showLabel && (
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ── Recent Inquiries ── */}
          {showLabel && (
            <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setHistoryOpen(h => !h)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '4px 8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
                <span>Recent</span>
                {historyOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 8px', margin: '4px 0 6px',
                borderRadius: 6, background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}>
                <Search size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter…"
                  style={{
                    flex: 1, minWidth: 0, background: 'transparent',
                    border: 'none', outline: 'none',
                    fontSize: 11, color: 'var(--text-primary)',
                  }}
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
                      <div style={{ padding: '6px 8px', fontSize: 11, color: 'var(--text-muted)' }}>
                        No history yet
                      </div>
                    ) : filtered.slice(0, 5).map(s => (
                      <div
                        key={s.id}
                        onClick={() => { onLoad(s.id); onNavigate('chat'); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '5px 8px', borderRadius: 6,
                          cursor: 'pointer', fontSize: 11,
                          color: activeId === s.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: activeId === s.id ? 'var(--bg-card)' : 'transparent',
                          transition: 'background 0.1s',
                        }}
                        onMouseOver={e => { if (activeId !== s.id) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                        onMouseOut={e => { if (activeId !== s.id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <MessageSquare size={11} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.title}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                          style={{
                            flexShrink: 0, padding: 2, background: 'none',
                            border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center',
                          }}
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

        {/* ── Footer: User + Controls ── */}
        <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', padding: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: showLabel ? 'space-between' : 'center',
            padding: '6px 8px', borderRadius: 7,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {/* Avatar with gradient */}
              <div style={{
                width: 24, height: 24, borderRadius: 7,
                background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: '#fff',
                boxShadow: '0 1px 4px rgba(99,102,241,0.3)',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {showLabel && (
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{
                    fontSize: 9.5, color: 'var(--text-muted)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.role || 'Scholar'}
                  </div>
                </div>
              )}
            </div>

            {showLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <button
                  onClick={onToggleDark}
                  title={darkMode ? 'Light mode' : 'Dark mode'}
                  style={{
                    padding: 5, borderRadius: 6, background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  style={{
                    padding: 5, borderRadius: 6, background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  }}
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
              title="Expand sidebar"
              style={{
                width: '100%', display: 'flex', justifyContent: 'center',
                padding: '6px 0', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', marginTop: 4,
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
