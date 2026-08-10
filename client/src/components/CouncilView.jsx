import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Send, Square, ChevronDown, ChevronUp,
  RefreshCw, Scale, CheckSquare, Loader2, User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FRAMEWORKS = [
  { id: 'utilitarianism', name: 'Utilitarianism',   icon: '⚖️', color: '#6366f1', shortName: 'Utilitarian'  },
  { id: 'deontology',     name: 'Deontology',        icon: '📜', color: '#0ea5e9', shortName: 'Deontologist' },
  { id: 'virtue',         name: 'Virtue Ethics',     icon: '🛡️', color: '#10b981', shortName: 'Virtue'       },
  { id: 'care',           name: 'Care Ethics',        icon: '🤝', color: '#f59e0b', shortName: 'Care'         },
  { id: 'rights',         name: 'Rights-Based',       icon: '🔑', color: '#ef4444', shortName: 'Rights'       },
  { id: 'justice',        name: 'Justice & Fairness', icon: '8b5cf6', shortName: 'Justice'      },
];

const EXAMPLE_DILEMMAS = [
  'Should an AI be used to make parole decisions in criminal justice?',
  'Is it ethical to share user location data with third parties to improve emergency services?',
  'Should pharmaceutical companies be allowed to price life-saving drugs at market rate?',
];

function CouncilMessage({ item, index }) {
  const [expanded, setExpanded] = useState(true);

  if (item.type === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}
      >
        <div style={{
          maxWidth: '85%', padding: '12px 16px', borderRadius: 10,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <User size={11} /> You (Follow-up)
          </div>
          {item.text}
        </div>
      </motion.div>
    );
  }

  const { fw, text, done } = item;
  const isLoading = !done;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{ display: 'flex', gap: 12 }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${fw.color}18`, border: `1px solid ${fw.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, marginTop: 2
      }}>
        {fw.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Speaker header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: fw.color }}>{fw.name}</span>
          {isLoading && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Deliberating…
            </span>
          )}
          {!isLoading && text && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 2 }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Message bubble */}
        <div style={{
          borderRadius: 12, borderTopLeftRadius: 3,
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          overflow: 'hidden',
        }}>
          {isLoading && !text && (
            <div style={{ padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i}
                  animate={{ y: [-3, 0, -3], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: fw.color }}
                />
              ))}
            </div>
          )}
          <AnimatePresence>
            {(text && expanded) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                </div>
              </motion.div>
            )}
            {(text && !expanded) && (
              <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {text.slice(0, 80)}…
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function CouncilView({ provider }) {
  const [dilemma,   setDilemma]   = useState('');
  const [selected,  setSelected]  = useState(FRAMEWORKS.map(f => f.id));
  const [items,     setItems]     = useState([]);   // [{ type: 'fw'|'user', fw?, text, done? }]
  const [followUp,  setFollowUp]  = useState('');
  const [running,   setRunning]   = useState(false);
  const [done,      setDone]      = useState(false);
  const bottomRef = useRef(null);
  const abortRefs = useRef({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, running]);

  const toggleFw = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const streamCouncilMember = async (fw, userPrompt, isFollowUp = false) => {
    const itemIndex = items.length;
    setItems(prev => [...prev, { type: 'fw', fw, text: '', done: false }]);

    const ctrl = new AbortController();
    abortRefs.current[fw.id] = ctrl;

    const contextStr = isFollowUp
      ? `The user submitted a follow-up response to the Ethics Council: "${userPrompt}". Respond from the perspective of ${fw.name}. Be direct, concise, and address the user's specific challenge or question.`
      : `You are participating in an Ethics Council debate as the ${fw.name} voice.
Other frameworks present: ${selected.filter(id => id !== fw.id).map(id => FRAMEWORKS.find(f => f.id === id)?.name).join(', ')}.

Deliver your council opening statement on this dilemma: "${userPrompt}". Be direct and use your framework's distinctive voice.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider || 'groq',
          frameworkKey: fw.id,
          history: [],
          message: contextStr,
          depth: 'standard',
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '', full = '';

      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              full += data.content;
              setItems(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx] && updated[lastIdx].fw?.id === fw.id) {
                  updated[lastIdx] = { ...updated[lastIdx], text: full };
                }
                return updated;
              });
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          } catch { /* skip */ }
        }
      }
      setItems(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx] && updated[lastIdx].fw?.id === fw.id) {
          updated[lastIdx] = { ...updated[lastIdx], text: full, done: true };
        }
        return updated;
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setItems(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx] && updated[lastIdx].fw?.id === fw.id) {
            updated[lastIdx] = { ...updated[lastIdx], text: `Error: ${err.message}`, done: true };
          }
          return updated;
        });
      }
    }
  };

  const runCouncil = async () => {
    if (!dilemma.trim() || running || selected.length < 2) return;
    setItems([]);
    setDone(false);
    setRunning(true);
    const members = FRAMEWORKS.filter(fw => selected.includes(fw.id));
    for (const fw of members) {
      await streamCouncilMember(fw, dilemma.trim(), false);
    }
    setRunning(false);
    setDone(true);
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || running) return;
    const text = followUp.trim();
    setFollowUp('');
    setItems(prev => [...prev, { type: 'user', text }]);
    setRunning(true);
    setDone(false);

    const members = FRAMEWORKS.filter(fw => selected.includes(fw.id));
    for (const fw of members) {
      await streamCouncilMember(fw, text, true);
    }
    setRunning(false);
    setDone(true);
  };

  const stopAll = () => {
    Object.values(abortRefs.current).forEach(c => c?.abort());
    setRunning(false);
  };

  const reset = () => { setItems([]); setDone(false); setDilemma(''); setFollowUp(''); };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>

          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ padding: 8, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <Users size={16} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Ethics Council
              </h1>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Assemble a panel of ethical framework voices. Convene the council, listen to their deliberation, and send follow-up questions directly to the panel.
            </p>
          </div>

          {/* Dilemma + Settings */}
          {items.length === 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Council Member Selection */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Select Council Members ({selected.length}/{FRAMEWORKS.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {FRAMEWORKS.map(fw => {
                    const isOn = selected.includes(fw.id);
                    return (
                      <button
                        key={fw.id}
                        onClick={() => toggleFw(fw.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                          border: isOn ? `1px solid ${fw.color}50` : '1px solid var(--border)',
                          background: isOn ? `${fw.color}0e` : 'var(--bg-surface)',
                          transition: 'all 0.12s',
                        }}
                      >
                        <CheckSquare size={13} style={{ color: isOn ? fw.color : 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: isOn ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {fw.icon} {fw.shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dilemma input */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Dilemma
                </label>
                <textarea
                  value={dilemma}
                  onChange={e => setDilemma(e.target.value)}
                  placeholder="State the ethical dilemma for the council to deliberate on…"
                  rows={3}
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '12px 14px',
                    borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-surface)', color: 'var(--text-primary)',
                    fontSize: 13, lineHeight: 1.6, resize: 'vertical', outline: 'none',
                    fontFamily: 'inherit', transition: 'border-color 0.15s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                {/* Examples */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {EXAMPLE_DILEMMAS.map((d, i) => (
                    <button key={i} onClick={() => setDilemma(d)}
                      style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {d.slice(0, 55)}…
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={runCouncil}
                  disabled={!dilemma.trim() || running || selected.length < 2}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 20px', borderRadius: 8, border: 'none',
                    background: !dilemma.trim() || running || selected.length < 2 ? 'var(--bg-surface)' : 'var(--accent)',
                    color: !dilemma.trim() || running || selected.length < 2 ? 'var(--text-muted)' : 'var(--bg-card)',
                    fontSize: 13, fontWeight: 700, cursor: !dilemma.trim() || running || selected.length < 2 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {running ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Deliberating…</> : <><Scale size={14} /> Convene Council</>}
                </button>
                {selected.length < 2 && <span style={{ fontSize: 11, color: '#f59e0b' }}>Select at least 2 frameworks</span>}
              </div>
            </div>
          )}

          {/* Council Session Feed */}
          {items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Council Session in Progress
                </span>
                <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <RefreshCw size={11} /> New Session
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {items.map((item, i) => (
                  <CouncilMessage key={i} item={item} index={i} />
                ))}
              </div>

              <div ref={bottomRef} />

              {/* Follow-up Prompt Bar */}
              <div style={{
                display: 'flex', gap: 10, marginTop: 12, padding: '14px 16px',
                borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <input
                  type="text"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleFollowUp(); }}
                  placeholder="Send a follow-up response or challenge to the Council…"
                  disabled={running}
                  style={{
                    flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--bg-surface)',
                    color: 'var(--text-primary)', fontSize: 13, outline: 'none'
                  }}
                />
                <button
                  onClick={handleFollowUp}
                  disabled={!followUp.trim() || running}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 18px', borderRadius: 8, border: 'none',
                    background: !followUp.trim() || running ? 'var(--bg-surface)' : 'var(--accent)',
                    color: !followUp.trim() || running ? 'var(--text-muted)' : 'var(--bg-card)',
                    fontSize: 13, fontWeight: 700, cursor: !followUp.trim() || running ? 'not-allowed' : 'pointer'
                  }}
                >
                  {running ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />} Respond to Council
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <Users size={36} style={{ margin: '0 auto 14px', opacity: 0.25 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Council Chamber Ready</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Select your council members, state a dilemma, and convene to begin the debate.</div>
            </div>
          )}

        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
