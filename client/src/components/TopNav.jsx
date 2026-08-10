import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sun, Moon, User, ChevronDown,
  Settings, BookOpen, Shield, Menu, X, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NOTIFICATIONS = [
  { id: 1, title: 'Analysis Complete', desc: 'AI in hiring decisions critique saved.', time: '5m ago', unread: true },
  { id: 2, title: 'New Case Study', desc: 'Autonomous weapons case module updated.', time: '2h ago', unread: true },
];

export default function TopNav({ darkMode, onToggleDark, onOpenPalette, onNavigate, onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <header style={{
      flexShrink: 0,
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)',
      zIndex: 30
    }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          className="md:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <button
          onClick={onOpenPalette}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            fontSize: 12, color: 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.12s ease',
            boxShadow: 'var(--shadow-sm)',
            width: '100%', maxWidth: 360
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Search frameworks, case studies...</span>
          <kbd style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 4px', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 'auto' }}>⌘K</kbd>
        </button>
      </div>

      {/* Right Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Status Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 8px', borderRadius: 20,
          border: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          <span>Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            style={{
              padding: 6, borderRadius: 6, background: 'none',
              border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              position: 'relative'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--text-primary)' }} />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 6,
                  width: 280, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 50
                }}
              >
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
                  {unread > 0 && <span style={{ fontSize: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: 4 }}>{unread} new</span>}
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{n.desc}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDark}
          style={{
            padding: 6, borderRadius: 6, background: 'none',
            border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 6px', borderRadius: 6, background: 'var(--bg-surface)',
              border: '1px solid var(--border)', cursor: 'pointer'
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--accent)', color: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 6,
                  width: 180, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 50
                }}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{user?.email || 'scholar@ethics.ai'}</div>
                </div>
                {[
                  { label: 'Ethical Frameworks', route: 'frameworks', icon: <BookOpen size={13} /> },
                  { label: 'Saved Analyses', route: 'saved', icon: <Shield size={13} /> },
                  { label: 'Settings & Models', route: 'settings', icon: <Settings size={13} /> },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(item.route); setProfileOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 12px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)',
                      textAlign: 'left'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 2 }}>
                  <button
                    onClick={logout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 12px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 12, color: '#ef4444', textAlign: 'left'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
