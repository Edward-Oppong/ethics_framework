import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Square, Users, ChevronDown, Sparkles, Scale } from 'lucide-react';

const SUGGESTED = [
  { label: 'Council Debate', text: 'Summon the Council on: Should facial recognition technology be banned in public urban spaces?', mode: 'council', frameworkKey: null },
  { label: 'Utilitarian Lens', text: 'Analyze through Utilitarianism: Is it ethical to automate human creative roles to save costs?', mode: 'single', frameworkKey: 'utilitarianism' },
  { label: 'Kantian Duty', text: 'Analyze through Deontology: Is it permissible to lie to protect an innocent person from harm?', mode: 'single', frameworkKey: 'deontology' },
  { label: 'Rights & Privacy', text: 'Should tech companies share user location records with law enforcement during public emergencies?', mode: 'standard', frameworkKey: null },
];

const MODES = [
  { id: 'standard', label: 'Pluralistic (All Frameworks)', icon: <Scale size={12} style={{ color: 'var(--text-primary)' }} />, frameworkKey: null, color: 'var(--text-primary)', bg: 'var(--bg-surface)', border: 'var(--border)' },
  { id: 'council',  label: 'Council Debate Mode',          icon: <Users size={12} style={{ color: '#f59e0b' }} />, frameworkKey: null, color: '#f59e0b', bg: '#f59e0b14', border: '#f59e0b50' },
  { id: 'utilitarianism', label: 'Utilitarianism Only',    icon: '⚖️', frameworkKey: 'utilitarianism', color: '#6366f1', bg: '#6366f114', border: '#6366f150' },
  { id: 'deontology',     label: 'Deontology Only',        icon: '📜', frameworkKey: 'deontology',     color: '#0ea5e9', bg: '#0ea5e914', border: '#0ea5e950' },
  { id: 'virtue',         label: 'Virtue Ethics Only',     icon: '🛡️', frameworkKey: 'virtue',         color: '#10b981', bg: '#10b98114', border: '#10b98150' },
  { id: 'care',           label: 'Care Ethics Only',       icon: '🤝', frameworkKey: 'care',           color: '#f59e0b', bg: '#f59e0b14', border: '#f59e0b50' },
  { id: 'rights',         label: 'Rights-Based Only',      icon: '🔑', frameworkKey: 'rights',         color: '#ef4444', bg: '#ef444414', border: '#ef444450' },
  { id: 'justice',        label: 'Justice & Fairness Only', icon: '🏛️', frameworkKey: 'justice',        color: '#8b5cf6', bg: '#8b5cf614', border: '#8b5cf650' },
];

export default function InputBar({ onSend, onAbort, isStreaming }) {
  const [text, setText] = useState('');
  const [selectedMode, setSelectedMode] = useState(MODES[0]); // default standard
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const isCouncil = selectedMode.id === 'council';
    const frameworkKey = selectedMode.frameworkKey;
    onSend(trimmed, isCouncil, [], 'standard', frameworkKey);
    setText('');
    setShowSuggested(false);
    setShowModeMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [text]);

  return (
    <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '12px 20px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        
        {/* Prompt Suggestions Popup */}
        <AnimatePresence>
          {showSuggested && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, overflow: 'hidden' }}
            >
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setText(s.text);
                    const found = MODES.find(m => m.frameworkKey === s.frameworkKey || m.id === s.mode) || MODES[0];
                    setSelectedMode(found);
                    setShowSuggested(false);
                  }}
                  style={{
                    padding: '8px 10px', borderRadius: 6,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    textAlign: 'left', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {s.text}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Box */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          padding: '8px 12px', borderRadius: 8,
          background: 'var(--bg-primary)', border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 2, position: 'relative' }}>
            <button
              onClick={() => { setShowSuggested(v => !v); setShowModeMenu(false); }}
              title="Prompts"
              style={{ padding: 4, borderRadius: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Sparkles size={15} />
            </button>

            {/* Mode & Framework Selector Button — Color Styled */}
            <button
              onClick={() => { setShowModeMenu(v => !v); setShowSuggested(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 6,
                border: `1px solid ${selectedMode.border}`,
                background: selectedMode.bg,
                color: selectedMode.color,
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ display: 'flex', fontSize: 12 }}>{selectedMode.icon}</span>
              <span>{selectedMode.label}</span>
              <ChevronDown size={11} style={{ opacity: 0.7 }} />
            </button>

            {/* Mode Menu Dropdown */}
            <AnimatePresence>
              {showModeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute', left: 0, bottom: '100%', marginBottom: 8,
                    width: 230, background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: 8,
                    boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 50
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    Select Analysis Mode
                  </div>
                  <div style={{ maxHeight: 240, overflowY: 'auto', padding: '4px 0' }}>
                    {MODES.map(m => {
                      const isActive = selectedMode.id === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedMode(m); setShowModeMenu(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 12px',
                            background: isActive ? m.bg : 'none',
                            borderLeft: isActive ? `3px solid ${m.color}` : '3px solid transparent',
                            borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                            cursor: 'pointer', fontSize: 12,
                            color: isActive ? m.color : 'var(--text-secondary)',
                            fontWeight: isActive ? 700 : 500, textAlign: 'left'
                          }}
                          onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-surface)'; }}
                          onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}
                        >
                          <span style={{ fontSize: 12, display: 'flex', flexShrink: 0 }}>{m.icon}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedMode.id === 'council'
                ? 'Describe a dilemma for the Council of Ethics Personas to debate…'
                : selectedMode.frameworkKey
                ? `Describe a dilemma to analyze strictly through ${selectedMode.label}…`
                : 'Describe an ethical dilemma or decision to analyze…'
            }
            rows={1}
            disabled={isStreaming}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13, color: 'var(--text-primary)', resize: 'none',
              padding: '4px 2px', lineHeight: 1.5, minHeight: 28, maxHeight: 140
            }}
          />

          <div style={{ paddingBottom: 2 }}>
            {isStreaming ? (
              <button
                onClick={onAbort}
                style={{ padding: 6, borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <Square size={13} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  background: text.trim() ? 'var(--accent)' : 'var(--bg-surface)',
                  color: text.trim() ? 'var(--bg-card)' : 'var(--text-muted)',
                  border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 600, transition: 'all 0.12s'
                }}
              >
                <Send size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Shortcut Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
          <div>
            Press <kbd style={{ background: 'var(--bg-surface)', padding: '1px 4px', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace' }}>Enter</kbd> to submit
          </div>
          <span style={{ color: selectedMode.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            Active: {selectedMode.label}
          </span>
        </div>

      </div>
    </div>
  );
}
