import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Brain, MessageSquare, Grid, BarChart2, BookOpen,
  Layout, Plus, Search, X, ChevronRight, Star, FolderOpen,
  User, Settings, Shield, TrendingUp, Lightbulb
} from 'lucide-react';

const NAV_ROUTES = [
  { id: 'home',       label: 'Dashboard',          icon: <Layout size={16} /> },
  { id: 'chat',       label: 'Ethics Assistant',   icon: <MessageSquare size={16} /> },
  { id: 'council',    label: 'Ethics Council',     icon: <Scale size={16} /> },
  { id: 'analyzer',   label: 'Decision Analyzer',  icon: <Brain size={16} /> },
  { id: 'comparison', label: 'Compare Frameworks', icon: <TrendingUp size={16} /> },
  { id: 'frameworks', label: 'Framework Library',  icon: <BookOpen size={16} /> },
  { id: 'cases',      label: 'Case Studies',       icon: <Grid size={16} /> },
  { id: 'history',    label: 'History & Sessions', icon: <FolderOpen size={16} /> },
  { id: 'settings',   label: 'Settings',           icon: <Settings size={16} /> },
];

export default function CommandPalette({ onNavigate, isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  const filtered = NAV_ROUTES.filter(r =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[18vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden z-10"
          >
            {/* Search Row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
              <Search size={16} className="text-[var(--text-muted)] flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') onClose();
                  if (e.key === 'Enter' && filtered.length > 0) {
                    onNavigate(filtered[0].id);
                    onClose();
                  }
                }}
                placeholder="Search pages…"
                className="flex-1 bg-transparent text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] outline-none"
              />
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">No results found</div>
              ) : filtered.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onNavigate(r.id); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors group"
                >
                  <span className="text-[var(--text-muted)] group-hover:text-primary transition-colors">{r.icon}</span>
                  <span className="flex-1">{r.label}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]" />
                </button>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-[var(--border)] flex gap-4 text-[10px] text-[var(--text-muted)]">
              <span><kbd className="bg-[var(--bg-card)] px-1.5 py-0.5 rounded font-mono">↵</kbd> Select</span>
              <span><kbd className="bg-[var(--bg-card)] px-1.5 py-0.5 rounded font-mono">Esc</kbd> Dismiss</span>
              <span className="ml-auto"><kbd className="bg-[var(--bg-card)] px-1.5 py-0.5 rounded font-mono">⌘K</kbd> Toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
