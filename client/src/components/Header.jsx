import { motion } from 'framer-motion';
import { Menu, Scale, Command, Sun, Moon, X } from 'lucide-react';

export default function Header({
  onToggleSidebar, sidebarOpen, focusActive, onToggleFocus,
  onOpenPalette, darkMode, onToggleDark, activeView
}) {
  const VIEW_LABELS = {
    home: 'Home',
    chat: 'AI Ethics Chat',
    frameworks: 'Framework Library',
    analyzer: 'Decision Analyzer',
    cases: 'Case Studies',
    dashboard: 'Dashboard',
  };

  return (
    <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm">
          <Scale size={14} className="text-primary" />
          <span className="text-[var(--text-muted)] hidden sm:inline">Ethics Critic</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">/</span>
          <span className="font-semibold text-[var(--text-primary)]">{VIEW_LABELS[activeView] || 'Home'}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Command palette trigger */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onOpenPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-primary/30 transition-all"
        >
          <Command size={12} />
          <span>Search</span>
          <kbd className="ml-1 bg-[var(--bg-surface)] px-1.5 py-0.5 rounded font-mono text-[10px]">⌘K</kbd>
        </motion.button>

        {/* Focus mode — only for chat */}
        {activeView === 'chat' && (
          <button
            onClick={onToggleFocus}
            title={focusActive ? 'Exit Focus Mode' : 'Focus Mode'}
            className={`p-1.5 rounded-lg transition-colors ${focusActive ? 'text-primary bg-primary/10' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'}`}
          >
            {focusActive
              ? <Scale size={16} className="text-primary" />
              : <Scale size={16} />
            }
          </button>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          LIVE
        </div>
      </div>
    </header>
  );
}
