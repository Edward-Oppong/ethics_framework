import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Loader2, ChevronRight, MessageSquare, ArrowRight, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FRAMEWORKS = [
  {
    id: 'utilitarianism', name: 'Utilitarianism', icon: '⚖️', color: '#6366f1',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Maximize welfare. Weigh consequences.',
    desc: 'Judges actions by their outcomes — the greatest good for the greatest number. Rigorous, numerate, and comfortable with difficult tradeoffs.',
  },
  {
    id: 'deontology', name: 'Deontology', icon: '📜', color: '#0ea5e9',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Duties first. Rules are non-negotiable.',
    desc: 'Judges actions by moral duties and the Categorical Imperative — regardless of consequences. Protects individual rights absolutely.',
  },
  {
    id: 'virtue', name: 'Virtue Ethics', icon: '🛡️', color: '#10b981',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Character matters. What would a wise person do?',
    desc: "Judges actions by the character they express. Focuses on practical wisdom (phronesis), human flourishing, and Aristotle's Golden Mean.",
  },
  {
    id: 'care', name: 'Care Ethics', icon: '🤝', color: '#f59e0b',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Relationships and vulnerability are central.',
    desc: 'Centers empathy, dependency, and our concrete responsibilities to those we are in relationship with. Rejects cold, abstract metrics.',
  },
  {
    id: 'rights', name: 'Rights-Based Ethics', icon: '🔑', color: '#ef4444',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Some rights can never be traded away.',
    desc: 'Evaluates actions by whether they violate fundamental inalienable rights — privacy, autonomy, consent, freedom — regardless of aggregate benefit.',
  },
  {
    id: 'justice', name: 'Justice & Fairness', icon: '🏛️', color: '#8b5cf6',
    model: 'Llama-3.3 70B via Groq',
    tagline: 'Fair distribution and procedural equity.',
    desc: "Applies Rawlsian principles — the Veil of Ignorance, fair distribution of benefits and burdens — protecting the least advantaged.",
  },
];

const EXAMPLES = [
  'Should AI replace human judges in criminal sentencing?',
  'Is it ethical for employers to monitor employee communications?',
  'Should gene editing be used to prevent hereditary diseases in embryos?',
];

export default function SingleFrameworkView({ provider, onSendToChat }) {
  const [selected,   setSelected]   = useState(null);
  const [dilemma,    setDilemma]    = useState('');
  const [messages,   setMessages]   = useState([]); // [{ role: 'user'|'assistant', content: '' }]
  const [followUp,   setFollowUp]   = useState('');
  const [streaming,  setStreaming]  = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const sendPrompt = async (text, isFollowUp = false) => {
    if (!text.trim() || !selected || streaming) return;

    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    
    // Add empty assistant response to stream into
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    if (isFollowUp) setFollowUp('');
    setStreaming(true);

    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

    let promptText = text.trim();
    if (!isFollowUp) {
      promptText = `Analyze this ethical dilemma exclusively through ${selected.name}. Structure your analysis clearly:

## Verdict
State your clear position: Support / Oppose / Nuanced — and why in one sentence.

## Core Analysis
Apply ${selected.name} principles rigorously. Be specific, not generic.

## Key Ethical Stakes
What rights, duties, consequences, or character traits are most at risk?

## Strongest Objection
What is the most powerful challenge to your position from another framework?

## Response to That Objection
How does ${selected.name} answer it?

## Conclusion
What should a decision-maker take away from this framework's lens?

Dilemma: ${text.trim()}`;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider || 'groq',
          frameworkKey: selected.id,
          history: historyForApi,
          message: promptText,
          depth: 'standard',
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
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
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: full };
                return updated;
              });
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: `Error: ${err.message}` };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setDilemma('');
    setFollowUp('');
    setSelected(null);
  };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Single Framework Analysis
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Choose one ethical lens, receive a structured analysis, and ask follow-up responses directly to that framework.
            </p>
          </div>

          {/* Framework Picker */}
          {!selected && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
                Choose a Framework
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {FRAMEWORKS.map(fw => (
                  <button
                    key={fw.id}
                    onClick={() => setSelected(fw)}
                    style={{
                      textAlign: 'left', padding: '18px', borderRadius: 10,
                      border: '1px solid var(--border)', background: 'var(--bg-card)',
                      cursor: 'pointer', transition: 'all 0.12s', boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = fw.color + '70'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 22 }}>{fw.icon}</span>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{fw.name}</div>
                    <div style={{ fontSize: 11, color: fw.color, fontWeight: 600, marginBottom: 8 }}>{fw.tagline}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{fw.desc}</div>
                    <div style={{ marginTop: 12, fontSize: 10, color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 20, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'inline-block' }}>
                      {fw.model}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Panel */}
          {selected && (
            <>
              {/* Selected Framework Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: 'var(--bg-card)', border: `1px solid ${selected.color}40`, boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: 24 }}>{selected.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.name} Agent</div>
                  <div style={{ fontSize: 11, color: selected.color, marginTop: 1 }}>{selected.tagline}</div>
                </div>
                <button
                  onClick={reset}
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Change Framework
                </button>
              </div>

              {/* Initial Input (if no conversation started) */}
              {messages.length === 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Ethical Dilemma
                  </label>
                  <textarea
                    value={dilemma}
                    onChange={e => setDilemma(e.target.value)}
                    placeholder={`Describe the dilemma you want analyzed through ${selected.name}…`}
                    rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '12px 14px',
                      borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg-surface)', color: 'var(--text-primary)',
                      fontSize: 13, lineHeight: 1.6, resize: 'vertical', outline: 'none',
                      fontFamily: 'inherit', transition: 'border-color 0.15s'
                    }}
                    onFocus={e => e.target.style.borderColor = selected.color}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {EXAMPLES.map((d, i) => (
                      <button key={i} onClick={() => setDilemma(d)}
                        style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {d.slice(0, 52)}…
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => sendPrompt(dilemma, false)}
                      disabled={!dilemma.trim() || streaming}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '10px 20px', borderRadius: 8, border: 'none',
                        background: !dilemma.trim() || streaming ? 'var(--bg-surface)' : selected.color,
                        color: !dilemma.trim() || streaming ? 'var(--text-muted)' : '#fff',
                        fontSize: 13, fontWeight: 700, cursor: !dilemma.trim() || streaming ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {streaming
                        ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</>
                        : <><Send size={14} /> Start Analysis with {selected.name}</>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Multi-Turn Thread */}
              {messages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map((m, idx) => {
                    const isUser = m.role === 'user';
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}
                      >
                        {/* Header line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: isUser ? 'var(--text-muted)' : selected.color }}>
                          {isUser ? <><User size={12} /> You</> : <>{selected.icon} {selected.name} Agent</>}
                        </div>

                        {/* Bubble */}
                        <div style={{
                          maxWidth: isUser ? '85%' : '100%',
                          padding: isUser ? '12px 16px' : '18px 20px',
                          borderRadius: 10,
                          border: isUser ? '1px solid var(--border)' : `1px solid ${selected.color}30`,
                          background: isUser ? 'var(--bg-surface)' : 'var(--bg-card)',
                          boxShadow: 'var(--shadow-sm)',
                          fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)',
                        }}>
                          {isUser ? (
                            <div>{m.content}</div>
                          ) : m.content ? (
                            <div className="prose-sm">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', items: 'center', gap: 6, color: 'var(--text-muted)' }}>
                              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Reasoned from {selected.name} principles…
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  <div ref={bottomRef} />

                  {/* Follow-up input bar */}
                  {!streaming && (
                    <div style={{
                      display: 'flex', gap: 10, marginTop: 12, padding: '14px 16px',
                      borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <input
                        type="text"
                        value={followUp}
                        onChange={e => setFollowUp(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') sendPrompt(followUp, true); }}
                        placeholder={`Send a follow-up response or question to the ${selected.name} agent…`}
                        style={{
                          flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: 8,
                          border: '1px solid var(--border)', background: 'var(--bg-surface)',
                          color: 'var(--text-primary)', fontSize: 13, outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => sendPrompt(followUp, true)}
                        disabled={!followUp.trim() || streaming}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '10px 18px', borderRadius: 8, border: 'none',
                          background: !followUp.trim() ? 'var(--bg-surface)' : selected.color,
                          color: !followUp.trim() ? 'var(--text-muted)' : '#fff',
                          fontSize: 13, fontWeight: 700, cursor: !followUp.trim() ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Send size={13} /> Respond
                      </button>
                      <button
                        onClick={reset}
                        style={{
                          padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
                          background: 'var(--bg-surface)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
