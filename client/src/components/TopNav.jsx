import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';

const VIEW_LABELS = {
  home:       'Dashboard',
  chat:       'Ethics Assistant',
  frameworks: 'Ethical Frameworks',
  analyzer:   'Decision Analyzer',
  comparison: 'Compare Frameworks',
  council:    'Ethics Council',
  single:     'Single Framework',
  cases:      'Case Studies',
  saved:      'Saved Analyses',
  history:    'Inquiry History',
  settings:   'Settings',
};

export default function TopNav({ onOpenPalette, onNavigate, onToggleSidebar, sidebarOpen, activeView }) {
  return (
    <header style={{
      flexShrink: 0,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)',
      zIndex: 30,
      gap: 12,
    }}>
      {/* Left: mobile hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="md:hidden"
          aria-label="Toggle sidebar"
          style={{
            padding: 5, borderRadius: 6,
            background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        {/* Current view breadcrumb */}
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          display: 'none',
        }} className="md:block">
          {VIEW_LABELS[activeView] || 'Ethics Critic'}
        </span>
      </div>

      {/* Center: Command Palette Trigger */}
      <button
        onClick={onOpenPalette}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 7,
          border: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          fontSize: 12, color: 'var(--text-muted)',
          cursor: 'pointer', transition: 'all 0.12s ease',
          flex: '1 1 auto', maxWidth: 340,
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--bg-card)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'var(--bg-surface)';
        }}
      >
        <Search size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
          Search frameworks, case studies…
        </span>
        <kbd style={{
          fontSize: 10, background: 'var(--bg-card)',
          padding: '1px 5px', borderRadius: 4,
          border: '1px solid var(--border)',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-muted)', flexShrink: 0,
        }}>⌘K</kbd>
      </button>

      {/* Right: spacer to balance layout */}
      <div style={{ width: 32, flexShrink: 0 }} className="md:hidden" />
    </header>
  );
}
