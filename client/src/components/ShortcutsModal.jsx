// ============================================================
//  Ethics Critic — Global Keyboard Shortcuts Modal
// ============================================================

import { motion } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';

const SHORTCUTS = [
  { key: '⌘K / Ctrl+K', desc: 'Open Command Palette & Search' },
  { key: '?', desc: 'Toggle Keyboard Shortcuts' },
  { key: 'Esc', desc: 'Close any active modal or drawer' },
  { key: '1', desc: 'Jump to Dashboard' },
  { key: '2', desc: 'Jump to Ethics Assistant Chat' },
  { key: '3', desc: 'Jump to Compare Frameworks' },
  { key: '4', desc: 'Jump to Decision Analyzer' },
  { key: '5', desc: 'Jump to Council Mode Debate' },
  { key: '6', desc: 'Jump to Inquiry History' },
  { key: 'Enter', desc: 'Submit Dilemma / Send Message' },
  { key: 'Shift+Enter', desc: 'Add new line in dilemma prompt' },
];

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 460,
          background: 'var(--bg-card)', borderRadius: 14,
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)', zIndex: 10,
        }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Keyboard size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SHORTCUTS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < SHORTCUTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{s.desc}</span>
              <kbd style={{
                fontSize: 11, background: 'var(--bg-surface)', padding: '3px 8px',
                borderRadius: 6, border: '1px solid var(--border)',
                fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontWeight: 600
              }}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
