import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Brain, Loader2, ChevronDown, ChevronUp,
  BarChart2, RefreshCw, Send, CheckCircle, XCircle, MinusCircle,
  LayoutGrid, List, Download, Sparkles, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

export const ALL_FRAMEWORKS = [
  { id: 'utilitarianism', name: 'Utilitarianism',           icon: '⚖️', color: 'var(--color-terracotta)' },
  { id: 'deontology',     name: 'Deontology',                icon: '📜', color: '#0ea5e9' },
  { id: 'virtue',         name: 'Virtue Ethics',             icon: '🛡️', color: '#10b981' },
  { id: 'care',           name: 'Care Ethics',                icon: '🤝', color: '#f59e0b' },
  { id: 'rights',         name: 'Rights-Based',               icon: '🔑', color: 'var(--color-rust)' },
  { id: 'justice',        name: 'Justice & Fairness',         icon: '🏛️', color: '#8b5cf6' },
  { id: 'contractualism', name: 'Contractualism',            icon: '🤝', color: '#06b6d4' },
  { id: 'environmental',  name: 'Environmental & Biocentric', icon: '🌿', color: '#84cc16' },
  { id: 'pragmatism',     name: 'Pragmatic Ethics',           icon: '💡', color: '#ec4899' },
];

export const EVALUATION_PRESETS = [
  {
    category: 'AI & Autonomous Systems',
    dilemmas: [
      'Should hospitals deploy autonomous AI triage systems that improve overall survival rates but deprioritize elderly patients in ambiguous cases?',
      'Should fully autonomous vehicles prioritize passenger protection over pedestrian safety when collisions are unavoidable?',
      'Is it ethical to deploy real-time public facial recognition and predictive policing in urban high-crime zones?'
    ]
  },
  {
    category: 'Bioethics & Healthcare',
    dilemmas: [
      'Should human germline gene editing (CRISPR) be permissible to eliminate hereditary diseases despite genetic inequality risks?',
      'Is mandatory childhood vaccination policy ethically justifiable in a free democratic society?',
      'Should pharmaceutical firms retain 20-year patent exclusivity on life-saving pandemic treatments?'
    ]
  },
  {
    category: 'Corporate & Tech Governance',
    dilemmas: [
      'Is a tech employee morally obligated to leak internal documents showing their company\'s algorithm knowingly harms teenage mental health?',
      'Should social platforms use psychometric behavioral profiling to optimize political advertising and election turnout?',
      'Should tech corporations replace human junior workers with generative AI to maximize shareholder value?'
    ]
  },
  {
    category: 'Climate & Biosphere',
    dilemmas: [
      'Should nations deploy solar radiation management (stratospheric geoengineering) to halt runaway warming despite unknown planetary risks?',
      'Should developing nations be allowed to expand fossil-fuel energy to lift millions out of poverty despite future carbon debt?'
    ]
  }
];

// Detect verdict from AI response text
export function parseVerdict(text) {
  if (!text) return 'NEUTRAL';
  const t = text.toLowerCase();
  const supportWords = ['support', 'justified', 'permissible', 'approve', 'endorse', 'acceptable', 'morally sound', 'ethically sound', 'recommend', 'favor'];
  const opposeWords  = ['oppose', 'unjustified', 'impermissible', 'reject', 'violates', 'unethical', 'wrong', 'condemn', 'must not', 'should not', 'cannot be justified'];
  const neutralWords = ['nuanced', 'context-dependent', 'neither', 'mixed', 'ambiguous', 'conditional', 'depends', 'tension', 'balancing'];

  let support = 0, oppose = 0, neutral = 0;
  supportWords.forEach(w => { if (t.includes(w)) support++; });
  opposeWords.forEach(w  => { if (t.includes(w)) oppose++;  });
  neutralWords.forEach(w => { if (t.includes(w)) neutral++; });

  if (oppose > support && oppose > neutral) return 'OPPOSE';
  if (support > oppose && support > neutral) return 'SUPPORT';
  return 'NEUTRAL';
}

// Parse a rough confidence score from text length & linguistic confidence markers
export function parseConfidence(text) {
  if (!text) return 0;
  const strong = (text.match(/\b(clearly|certainly|definitively|must|absolutely|unequivocally|strongly|paramount)\b/gi) || []).length;
  const weak   = (text.match(/\b(perhaps|might|could|arguably|potentially|somewhat|partially|unclear)\b/gi) || []).length;
  const base = Math.min(95, 55 + (text.length / 80));
  return Math.max(30, Math.min(97, Math.round(base + strong * 4 - weak * 3)));
}

function VerdictBadge({ verdict }) {
  const map = {
    SUPPORT: { color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle size={11} />, label: 'Support' },
    OPPOSE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: <XCircle size={11} />,     label: 'Oppose'  },
    NEUTRAL: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: <MinusCircle size={11} />, label: 'Neutral' },
  };
  const v = map[verdict] || map.NEUTRAL;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: v.color, background: v.bg, border: `1px solid ${v.border}` }}>
      {v.icon} {v.label}
    </span>
  );
}

function FrameworkCard({ fw, result, expanded, onToggle, isGrid }) {
  const isLoading  = result?.status === 'loading';
  const isDone     = result?.status === 'done';
  const isError    = result?.status === 'error';
  const text       = result?.text || '';
  const verdict    = isDone ? parseVerdict(text) : null;
  const confidence = isDone ? parseConfidence(text) : 0;

  if (isGrid) {
    return (
      <div style={{
        borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)',
        padding: '16px', display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: 'var(--shadow-sm)', minHeight: 280
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{fw.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{fw.name}</span>
          </div>
          {isDone && <VerdictBadge verdict={verdict} />}
        </div>

        {isDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'var(--bg-surface)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8 }}
                style={{ height: '100%', borderRadius: 99, background: fw.color }}
              />
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{confidence}%</span>
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <Loader2 size={12} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Evaluating…</span>
          </div>
        )}

        <div style={{
          flex: 1, minHeight: 120, maxHeight: 320, overflowY: 'auto',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
          background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8,
          border: '1px solid var(--border)', whiteSpace: 'pre-wrap'
        }}>
          {isError ? <span style={{ color: '#ef4444' }}>{result?.error || 'Analysis error'}</span> : text || (isLoading ? 'Receiving critique tokens…' : 'Awaiting start…')}
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: isDone || isError ? 'pointer' : 'default' }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{fw.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{fw.name}</span>
            {isDone   && <VerdictBadge verdict={verdict} />}
            {isLoading && <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={10} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</span>}
            {isError  && <span style={{ fontSize: 10, color: '#ef4444' }}>Error</span>}
          </div>
          {isDone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ height: '100%', borderRadius: 99, background: fw.color }}
                />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{confidence}% confidence</span>
            </div>
          )}
          {isLoading && (
            <div style={{ height: 3, borderRadius: 99, background: 'var(--bg-surface)', overflow: 'hidden' }}>
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{ height: '100%', width: '40%', background: `linear-gradient(90deg, transparent, ${fw.color}, transparent)` }}
              />
            </div>
          )}
        </div>
        {(isDone || isError) && (
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && isDone && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {text}
              </p>
            </div>
          </motion.div>
        )}
        {expanded && isError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: '12px 16px', fontSize: 12, color: '#ef4444' }}>
              {result?.error || 'Failed to get a response from this framework agent.'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComparisonView({ provider, onSendToChat }) {
  const [dilemma,        setDilemma]        = useState('');
  const [followUp,       setFollowUp]       = useState('');
  const [results,        setResults]        = useState({});
  const [running,        setRunning]        = useState(false);
  const [done,           setDone]           = useState(false);
  const [expanded,       setExpanded]       = useState({});
  const [activeFws,      setActiveFws]      = useState(ALL_FRAMEWORKS.map(f => f.id));
  const [layoutMode,     setLayoutMode]     = useState('stacked'); // 'grid' | 'stacked'
  const [presetCategory, setPresetCategory] = useState(EVALUATION_PRESETS[0].category);
  const abortRefs = useRef({});

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const toggleFwSelection = (id) => {
    setActiveFws(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectedFrameworkList = ALL_FRAMEWORKS.filter(f => activeFws.includes(f.id));

  const streamFramework = async (fw, dilemmaText, isFollowUp = false) => {
    const existingText = results[fw.id]?.text || '';
    setResults(prev => ({ ...prev, [fw.id]: { status: 'loading', text: isFollowUp ? existingText + '\n\n---\n**Follow-up Response:**\n' : '' } }));

    const ctrl = new AbortController();
    abortRefs.current[fw.id] = ctrl;

    const messagePayload = isFollowUp
      ? `Previous Dilemma: "${dilemmaText}"\nPrevious Analysis: "${existingText.slice(0, 300)}..."\n\nUser Follow-up Response: "${followUp}"\n\nProvide your follow-up analysis strictly through ${fw.name}.`
      : `Analyze the following ethical dilemma through the lens of ${fw.name} only. Be thorough, direct, and clear. State your verdict (support/oppose/neutral) explicitly.\n\nDilemma: ${dilemmaText}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider || 'groq',
          frameworkKey: fw.id,
          history: [],
          message: messagePayload,
          depth: 'standard',
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '', full = isFollowUp ? existingText + '\n\n---\n**Follow-up Response:**\n' : '';

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
              setResults(prev => ({ ...prev, [fw.id]: { status: 'loading', text: full } }));
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          } catch { /* skip parse errors */ }
        }
      }
      setResults(prev => ({ ...prev, [fw.id]: { status: 'done', text: full } }));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setResults(prev => ({ ...prev, [fw.id]: { status: 'error', text: '', error: err.message } }));
      }
    }
  };

  const runComparison = async () => {
    if (!dilemma.trim() || running) return;
    setResults({});
    setExpanded({});
    setDone(false);
    setRunning(true);

    await Promise.all(selectedFrameworkList.map(fw => streamFramework(fw, dilemma.trim(), false)));
    setRunning(false);
    setDone(true);
  };

  const runFollowUp = async () => {
    if (!followUp.trim() || running) return;
    setFollowUp('');
    setRunning(true);
    setDone(false);

    await Promise.all(selectedFrameworkList.map(fw => streamFramework(fw, dilemma.trim(), true)));
    setRunning(false);
    setDone(true);
  };

  const stopAll = () => {
    Object.values(abortRefs.current).forEach(c => c?.abort());
    setRunning(false);
  };

  const reset = () => { setResults({}); setDone(false); setDilemma(''); setExpanded({}); };

  const exportMatrix = (format = 'md') => {
    if (!doneResults.length) return;
    let content = '';
    if (format === 'md') {
      content = `# Ethics Critic — Framework Comparison Matrix\n\n**Dilemma:** ${dilemma}\n**Date:** ${new Date().toISOString()}\n\n`;
      content += `| Framework | Verdict | Confidence | Key Analysis Summary |\n| :--- | :--- | :--- | :--- |\n`;
      doneResults.forEach(fw => {
        const text = results[fw.id]?.text || '';
        const v = parseVerdict(text);
        const c = parseConfidence(text);
        const snippet = text.replace(/[\n\r]+/g, ' ').slice(0, 160) + '...';
        content += `| ${fw.name} | ${v} | ${c}% | ${snippet} |\n`;
      });
      content += `\n\n## Full Framework Critiques\n\n`;
      doneResults.forEach(fw => {
        content += `### ${fw.name}\n\n${results[fw.id]?.text || ''}\n\n---\n\n`;
      });
    } else {
      // CSV
      content = `"Framework","Verdict","Confidence","Analysis"\n`;
      doneResults.forEach(fw => {
        const text = (results[fw.id]?.text || '').replace(/"/g, '""');
        const v = parseVerdict(text);
        const c = parseConfidence(text);
        content += `"${fw.name}","${v}","${c}%","${text}"\n`;
      });
    }

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `comparison_matrix_${Date.now()}.${format}`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Chart data ────────────────────────────────────────────
  const doneResults = selectedFrameworkList.filter(fw => results[fw.id]?.status === 'done');
  const barData  = doneResults.map(fw => ({
    name: fw.name.split(' ')[0],
    confidence: parseConfidence(results[fw.id].text),
    fill: fw.color,
  }));
  const radarData = doneResults.map(fw => ({
    subject: fw.name.split(' ')[0],
    confidence: parseConfidence(results[fw.id].text),
  }));

  const verdictCounts = { SUPPORT: 0, OPPOSE: 0, NEUTRAL: 0 };
  doneResults.forEach(fw => { verdictCounts[parseVerdict(results[fw.id].text)]++; });

  const TOOLTIP_STYLE = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--text-primary)' }
  };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Compare Frameworks
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Simultaneously analyze ethical dilemmas across 9 distinct philosophical lenses.
              </p>
            </div>

            {/* Layout Toggle */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
              <button
                onClick={() => setLayoutMode('stacked')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
                  border: 'none', background: layoutMode === 'stacked' ? 'var(--bg-surface)' : 'transparent',
                  color: layoutMode === 'stacked' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}
              >
                <List size={13} /> Stacked
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
                  border: 'none', background: layoutMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                  color: layoutMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}
              >
                <LayoutGrid size={13} /> Side-by-Side Grid
              </button>
            </div>
          </div>

          {/* Framework Selective Filter Pill Bar */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter size={12} /> Select Active Frameworks ({selectedFrameworkList.length}/{ALL_FRAMEWORKS.length})
              </span>
              <button
                onClick={() => setActiveFws(ALL_FRAMEWORKS.map(f => f.id))}
                style={{ fontSize: 11, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
              >
                Select All
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ALL_FRAMEWORKS.map(fw => {
                const isSelected = activeFws.includes(fw.id);
                return (
                  <button
                    key={fw.id}
                    onClick={() => toggleFwSelection(fw.id)}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
                      border: `1px solid ${isSelected ? 'var(--border-strong)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--bg-surface)' : 'transparent',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.1s'
                    }}
                  >
                    <span>{fw.icon}</span>
                    <span>{fw.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dilemma Input & Category Presets */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 10 }}>
              Ethical Dilemma
            </label>
            <textarea
              value={dilemma}
              onChange={e => setDilemma(e.target.value)}
              placeholder="Describe the dilemma you want to compare across chosen frameworks…"
              rows={4}
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

            {/* Presets by Domain */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Curated Presets:</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {EVALUATION_PRESETS.map(p => (
                    <button
                      key={p.category}
                      onClick={() => setPresetCategory(p.category)}
                      style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        border: 'none', background: presetCategory === p.category ? 'var(--accent)' : 'var(--bg-surface)',
                        color: presetCategory === p.category ? 'var(--bg-card)' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EVALUATION_PRESETS.find(p => p.category === presetCategory)?.dilemmas.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDilemma(d)}
                    style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      border: '1px solid var(--border)', background: 'var(--bg-surface)',
                      color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.1s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {d.slice(0, 75)}…
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <button
                onClick={runComparison}
                disabled={!dilemma.trim() || running}
                className={!dilemma.trim() || running ? '' : 'btn-primary'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 22px', borderRadius: 8, border: 'none',
                  background: !dilemma.trim() || running ? 'var(--bg-surface)' : 'var(--accent-gradient)',
                  color: !dilemma.trim() || running ? 'var(--text-muted)' : '#ffffff',
                  fontSize: 13, fontWeight: 700, cursor: !dilemma.trim() || running ? 'not-allowed' : 'pointer',
                }}
              >
                {running ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing {selectedFrameworkList.length} Frameworks…</> : <><Send size={14} /> Run Comparison</>}
              </button>
              {running && (
                <button onClick={stopAll} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Stop
                </button>
              )}
              {done && (
                <>
                  <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <RefreshCw size={13} /> New Comparison
                  </button>
                  <button onClick={() => exportMatrix('md')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <Download size={13} /> Export Matrix (MD)
                  </button>
                  <button onClick={() => exportMatrix('csv')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <Download size={13} /> Export CSV
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Live Results */}
          {Object.keys(results).length > 0 && (
            <>
              {/* Verdict Summary */}
              {doneResults.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Support', count: verdictCounts.SUPPORT, color: '#10b981' },
                    { label: 'Oppose',  count: verdictCounts.OPPOSE,  color: '#ef4444' },
                    { label: 'Neutral', count: verdictCounts.NEUTRAL, color: '#f59e0b' },
                  ].map((v, i) => (
                    <div key={i} style={{ padding: '18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: v.color, lineHeight: 1 }}>{v.count}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 6 }}>{v.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Charts */}
              {doneResults.length >= 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', height: 240, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>Confidence by Framework</div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} barSize={18}>
                          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                          <Tooltip {...TOOLTIP_STYLE} />
                          <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                            {barData.map((entry, i) => (
                              <motion.rect key={i} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', height: 240, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>Alignment Radar</div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="var(--border)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} />
                          <Radar dataKey="confidence" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.15} strokeWidth={2} />
                          <Tooltip {...TOOLTIP_STYLE} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Framework Views (Grid or Stacked) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Framework Verdicts — {doneResults.length}/{selectedFrameworkList.length} complete
                </div>

                {layoutMode === 'grid' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {selectedFrameworkList.map(fw => (
                      <FrameworkCard
                        key={fw.id}
                        fw={fw}
                        result={results[fw.id]}
                        expanded={true}
                        isGrid={true}
                        onToggle={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedFrameworkList.map(fw => (
                      <FrameworkCard
                        key={fw.id}
                        fw={fw}
                        result={results[fw.id]}
                        expanded={!!expanded[fw.id]}
                        isGrid={false}
                        onToggle={() => toggle(fw.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Question Bar */}
              {!running && (
                <div style={{
                  display: 'flex', gap: 10, padding: '14px 16px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
                }}>
                  <input
                    type="text"
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') runFollowUp(); }}
                    placeholder="Send a follow-up inquiry across all active frameworks…"
                    style={{
                      flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg-surface)',
                      color: 'var(--text-primary)', fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    onClick={runFollowUp}
                    disabled={!followUp.trim() || running}
                    className={!followUp.trim() || running ? '' : 'btn-primary'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                      borderRadius: 8, border: 'none',
                      background: !followUp.trim() ? 'var(--bg-surface)' : 'var(--accent-gradient)',
                      color: !followUp.trim() ? 'var(--text-muted)' : '#ffffff',
                      fontSize: 13, fontWeight: 700, cursor: !followUp.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Send size={13} /> Follow-up
                  </button>
                </div>
              )}

              {/* Send to Council */}
              {done && (
                <button
                  onClick={() => onSendToChat(`Run a full Council Mode debate on this dilemma: "${dilemma}". We have initial verdicts from ${selectedFrameworkList.map(f => f.name).join(', ')} — now debate the tensions.`)}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Scale size={15} />
                  Send to Council Mode — Full Multi-Framework Debate
                </button>
              )}
            </>
          )}

          {/* Empty state */}
          {Object.keys(results).length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <BarChart2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No comparison run yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Select your frameworks, pick an example or enter a dilemma above, and click Run Comparison.</div>
            </div>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
