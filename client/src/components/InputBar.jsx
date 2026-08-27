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
  { id: 'standard',      label: 'Pluralistic',   icon: <Scale size={12} />,  frameworkKey: null,            color: 'var(--text-primary)', bg: 'var(--bg-surface)', border: 'var(--border)' },
  { id: 'council',       label: 'Council',        icon: <Users size={12} />,  frameworkKey: null,            color: '#f59e0b', bg: '#f59e0b14', border: '#f59e0b50' },
  { id: 'utilitarianism', label: 'Utilitarian',   icon: '⚖️',                 frameworkKey: 'utilitarianism', color: '#6366f1', bg: '#6366f114', border: '#6366f150' },
  { id: 'deontology',    label: 'Deontology',     icon: '📜',                 frameworkKey: 'deontology',    color: '#0ea5e9', bg: '#0ea5e914', border: '#0ea5e950' },
  { id: 'virtue',        label: 'Virtue Ethics',  icon: '🛡️',                 frameworkKey: 'virtue',        color: '#10b981', bg: '#10b98114', border: '#10b98150' },
  { id: 'care',          label: 'Care Ethics',    icon: '🤝',                 frameworkKey: 'care',          color: '#f59e0b', bg: '#f59e0b14', border: '#f59e0b50' },
  { id: 'rights',        label: 'Rights-Based',   icon: '🔑',                 frameworkKey: 'rights',        color: '#ef4444', bg: '#ef444414', border: '#ef444450' },
  { id: 'justice',       label: 'Justice',        icon: '🏛️',                 frameworkKey: 'justice',       color: '#8b5cf6', bg: '#8b5cf614', border: '#8b5cf650' },
];

export default function InputBar({ onSend, onAbort, isStreaming }) {
  const [text, setText]               = useState('');
  const [selectedMode, setSelectedMode] = useState(MODES[0]);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed, selectedMode.id === 'council', [], 'standard', selectedMode.frameworkKey);
    setText('');
    setShowSuggested(false);
    setShowModeMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [text]);

  return (
    <div style={{
      flexShrink: 0, borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)', padding: '10px 20px 14px',
      width: '100%',
    }}>
      <div style={{ maxWidth: 1040, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Prompt Suggestions */}
        <AnimatePresence>
          {showSuggested && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 7, overflow: 'hidden',
              }}
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
                    padding: '8px 10px', borderRadius: 7,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.12s',
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 3 }}>{s.label}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-secondary)',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
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
          padding: '8px 12px', borderRadius: 10,
          background: 'var(--bg-primary)', border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
          onFocus={e => {
            const parent = e.currentTarget;
            parent.style.borderColor = 'var(--indigo)';
            parent.style.boxShadow = 'var(--glow)';
          }}
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              const parent = e.currentTarget;
              parent.style.borderColor = 'var(--border-strong)';
              parent.style.boxShadow = 'var(--shadow-sm)';
            }
          }}
        >
          {/* Left controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 2, position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setShowSuggested(v => !v); setShowModeMenu(false); }}
              title="Prompt suggestions"
              style={{
                padding: 5, borderRadius: 5, background: 'none',
                border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center',
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Sparkles size={14} />
            </button>

            {/* Mode selector */}
            <button
              onClick={() => { setShowModeMenu(v => !v); setShowSuggested(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 6,
                border: `1px solid ${selectedMode.border}`,
                background: selectedMode.bg,
                color: selectedMode.color,
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ display: 'flex', fontSize: 12 }}>{selectedMode.icon}</span>
              <span>{selectedMode.label}</span>
              <ChevronDown size={10} style={{ opacity: 0.65 }} />
            </button>

            {/* Mode dropdown */}
            <AnimatePresence>
              {showModeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute', left: 0, bottom: '100%', marginBottom: 8,
                    width: 210, background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: 9,
                    boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 50,
                  }}
                >
                  <div style={{
                    padding: '6px 10px', fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
                  }}>
                    Analysis Mode
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
                            borderLeft: isActive ? `2px solid ${m.color}` : '2px solid transparent',
                            borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                            cursor: 'pointer', fontSize: 12,
                            color: isActive ? m.color : 'var(--text-secondary)',
                            fontWeight: isActive ? 700 : 500, textAlign: 'left',
                          }}
                          onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-surface)'; }}
                          onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}
                        >
                          <span style={{ fontSize: 12, display: 'flex', flexShrink: 0 }}>{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedMode.id === 'council'
                ? 'Describe a dilemma for the Council to debate…'
                : selectedMode.frameworkKey
                ? `Analyze through ${selectedMode.label}…`
                : 'Describe an ethical dilemma or decision…'
            }
            rows={1}
            disabled={isStreaming}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13.5, color: 'var(--text-primary)', resize: 'none',
              padding: '4px 2px', lineHeight: 1.55, minHeight: 28, maxHeight: 140,
            }}
          />

          {/* Send / Stop */}
          <div style={{ paddingBottom: 2, flexShrink: 0 }}>
            {isStreaming ? (
              <button
                onClick={onAbort}
                title="Stop generation"
                style={{
                  padding: 7, borderRadius: 7,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <Square size={12} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                title="Send (Enter)"
                style={{
                  padding: '7px 11px', borderRadius: 7,
                  background: text.trim() ? 'var(--accent-gradient)' : 'var(--bg-surface)',
                  color: text.trim() ? '#fff' : 'var(--text-muted)',
                  border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 700,
                  boxShadow: text.trim() ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                  transition: 'all 0.12s',
                }}
              >
                <Send size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10.5, color: 'var(--text-muted)', gap: 4,
        }}>
          <kbd style={{
            background: 'var(--bg-surface)', padding: '1px 5px',
            borderRadius: 4, border: '1px solid var(--border)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>Enter</kbd>
          <span>to send</span>
          <span style={{ opacity: 0.4, marginLeft: 4 }}>·</span>
          <kbd style={{
            background: 'var(--bg-surface)', padding: '1px 5px',
            borderRadius: 4, border: '1px solid var(--border)',
            fontFamily: 'JetBrains Mono, monospace', marginLeft: 4,
          }}>⇧Enter</kbd>
          <span>for new line</span>
        </div>

      </div>
    </div>
  );
}
