import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseStandardResponse, parseCouncilResponse } from '../utils/responseParser.js';
import {
  Scale, History, AlertOctagon, Undo2, ArrowRightLeft,
  ChevronDown, ChevronUp, Copy, Check, Users,
  BookOpen, Lightbulb, AlertTriangle, ShieldCheck,
  TrendingUp, TrendingDown, Minus, CircleDot, Info,
  CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─────────────────────────────────────────────────────────
// Utility: Copy Button
// ─────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        color: 'var(--text-muted)', transition: 'color 0.12s, border-color 0.12s',
        display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600,
      }}
      onMouseOver={e => { e.currentTarget.style.color = copied ? 'var(--emerald)' : 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      title="Copy"
    >
      {copied ? <Check size={11} style={{ color: 'var(--emerald)' }} /> : <Copy size={11} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Utility: Section Header
// ─────────────────────────────────────────────────────────

function SectionHeader({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
function stripAsterisks(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\*/g, '').trim();
}

// ─────────────────────────────────────────────────────────
// Utility: Prose Renderer
// ─────────────────────────────────────────────────────────

function Prose({ children, style }) {
  if (!children) return null;
  const cleanContent = typeof children === 'string' ? children.replace(/\*/g, '') : children;
  return (
    <div className="prose-sm" style={{ fontSize: 12.5, lineHeight: 1.65, color: 'var(--text-secondary)', ...style }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Chip / Badge
// ─────────────────────────────────────────────────────────

function Chip({ label, color = 'var(--text-muted)', bg = 'var(--bg-surface)', border }) {
  const cleanLabel = stripAsterisks(label);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 99,
      color, background: bg,
      border: border ? `1px solid ${border}` : `1px solid ${color}30`,
    }}>
      {cleanLabel}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Judgment badge colors
// ─────────────────────────────────────────────────────────

function judgmentColor(judgment) {
  const j = (judgment || '').toLowerCase();
  if (j.includes('support') && j.includes('conditional')) return 'var(--amber)';
  if (j.includes('support')) return 'var(--emerald)';
  if (j.includes('opposition') && j.includes('conditional')) return 'var(--amber)';
  if (j.includes('opposition') || j.includes('oppose')) return 'var(--red)';
  if (j.includes('mixed') || j.includes('contested')) return 'var(--indigo)';
  if (j.includes('insufficient')) return 'var(--text-muted)';
  return 'var(--text-muted)';
}

function positionColors(position) {
  const p = (position || '').toLowerCase();
  if (p.includes('conditional support')) return { color: 'var(--amber)', bg: 'var(--amber-dim)' };
  if (p.includes('support')) return { color: 'var(--emerald)', bg: 'var(--emerald-dim)' };
  if (p.includes('conditional opposition')) return { color: 'var(--amber)', bg: 'var(--amber-dim)' };
  if (p.includes('opposition') || p.includes('oppose')) return { color: 'var(--red)', bg: 'var(--red-dim)' };
  if (p.includes('mixed') || p.includes('contested')) return { color: 'var(--indigo)', bg: 'var(--indigo-dim)' };
  if (p.includes('insufficient')) return { color: 'var(--text-muted)', bg: 'var(--bg-surface)' };
  return { color: 'var(--text-muted)', bg: 'var(--bg-surface)' };
}

function confidenceColor(conf) {
  const c = (conf || '').toLowerCase();
  if (c === 'high') return 'var(--emerald)';
  if (c === 'moderate') return 'var(--amber)';
  if (c === 'low') return 'var(--red)';
  return 'var(--text-muted)';
}

function riskColor(risk) {
  const r = (risk || '').toLowerCase();
  if (r === 'high') return 'var(--red)';
  if (r.includes('medium') || r === 'moderate') return 'var(--amber)';
  if (r === 'low') return 'var(--emerald)';
  return 'var(--text-muted)';
}

// ─────────────────────────────────────────────────────────
// Framework Card
// ─────────────────────────────────────────────────────────

function FrameworkCard({ fw, index }) {
  const [expanded, setExpanded] = useState(false);
  const cleanJudgment = stripAsterisks(fw.judgment);
  const jColor = judgmentColor(cleanJudgment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{
        borderRadius: 10, border: '1px solid var(--border)',
        background: 'var(--bg-surface)', overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: jColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{stripAsterisks(fw.name)}</span>
          {cleanJudgment && (
            <Chip label={cleanJudgment} color={jColor} />
          )}
        </div>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8 }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fw.primaryConcern && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>Primary Concern</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{stripAsterisks(fw.primaryConcern)}</div>
                </div>
              )}
              {fw.keyPrinciple && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>Key Principle</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{stripAsterisks(fw.keyPrinciple)}</div>
                </div>
              )}
              {fw.analysis && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>Analysis</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{stripAsterisks(fw.analysis)}</div>
                </div>
              )}
              {/* Fallback: raw content for older-format responses */}
              {!fw.primaryConcern && !fw.analysis && fw.content && (
                <Prose>{fw.content}</Prose>
              )}
              {cleanJudgment && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 8,
                  background: `${jColor}12`, border: `1px solid ${jColor}25`,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: jColor }}>Judgment</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: jColor }}>{cleanJudgment}</span>
                  {fw.judgmentRationale && (
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>— {stripAsterisks(fw.judgmentRationale)}</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Stakeholder Grid
// ─────────────────────────────────────────────────────────

function StakeholderGrid({ stakeholders }) {
  if (!stakeholders || stakeholders.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {stakeholders.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          style={{
            padding: '10px 12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-surface)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 7 }}>{stripAsterisks(s.group)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {s.benefit && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <TrendingUp size={11} style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{stripAsterisks(s.benefit)}</span>
              </div>
            )}
            {s.harm && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <TrendingDown size={11} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{stripAsterisks(s.harm)}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Precedent Table
// ─────────────────────────────────────────────────────────

function PrecedentTable({ rows, prose }) {
  if (!rows || rows.length === 0) {
    return prose ? <Prose>{prose}</Prose> : null;
  }
  // Find actual column keys (header names vary slightly from model)
  const keys = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr>
            {keys.map(k => (
              <th key={k} style={{
                textAlign: 'left', padding: '6px 10px',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
                whiteSpace: 'nowrap',
              }}>{stripAsterisks(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              {keys.map(k => (
                <td key={k} style={{
                  padding: '8px 10px', color: 'var(--text-secondary)',
                  lineHeight: 1.55, verticalAlign: 'top',
                  background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)',
                }}>{stripAsterisks(row[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Pre-Mortem Table
// ─────────────────────────────────────────────────────────

const SEVERITY_COLOR = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--emerald)' };

function PreMortemTable({ rows, prose }) {
  if (!rows || rows.length === 0) {
    return prose ? <Prose>{prose}</Prose> : null;
  }
  const keys = Object.keys(rows[0]);
  // Detect the "Severity" column key regardless of exact capitalisation
  const severityKey = keys.find(k => k.toLowerCase().includes('severity')) || '';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr>
            {keys.map(k => (
              <th key={k} style={{
                textAlign: 'left', padding: '6px 10px',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
              }}>{stripAsterisks(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const sev = stripAsterisks(row[severityKey]) || '';
            const sevColor = SEVERITY_COLOR[sev] || 'var(--text-secondary)';
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                {keys.map(k => (
                  <td key={k} style={{
                    padding: '8px 10px', lineHeight: 1.55, verticalAlign: 'top',
                    color: k === severityKey ? sevColor : 'var(--text-secondary)',
                    fontWeight: k === severityKey ? 700 : 400,
                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)',
                  }}>{stripAsterisks(row[k])}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Reversibility Badge
// ─────────────────────────────────────────────────────────

function ReversibilityBadge({ score, prose }) {
  if (!score) {
    return prose ? <Prose>{prose}</Prose> : null;
  }
  const { score: n, outOf, label, justification } = score;
  const pct = (n / outOf) * 100;
  // Low score = more reversible = green; high = red
  const barColor = n <= 2 ? 'var(--emerald)' : n === 3 ? 'var(--amber)' : 'var(--red)';
  const textColor = barColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Score display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 3,
          fontSize: 28, fontWeight: 800, color: textColor, lineHeight: 1,
        }}>
          {n}
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>/ {outOf}</span>
        </div>
        <div>
          <Chip label={stripAsterisks(label)} color={textColor} />
          {n >= 4 && (
            <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 600, marginTop: 4 }}>
              ⚠ One-Way Door — higher burden of proof required
            </div>
          )}
        </div>
      </div>

      {/* Bar */}
      <div style={{ height: 5, width: '100%', borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          style={{ height: '100%', borderRadius: 99, background: barColor }}
        />
      </div>

      {/* Scale legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>
        <span>1 — Highly reversible</span>
        <span>5 — Irreversible</span>
      </div>

      {justification && (
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
          {stripAsterisks(justification)}
        </div>
      )}

      {/* Fallback prose for models that didn't use structured score */}
      {!justification && prose && <Prose>{prose}</Prose>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Lens Card (generic)
// ─────────────────────────────────────────────────────────

function LensCard({ icon, title, children, accentColor = 'var(--amber)' }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      border: `1px solid ${accentColor}25`,
      background: `${accentColor}08`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ color: accentColor }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Convergence & Conflict Panel
// ─────────────────────────────────────────────────────────

function ConvergenceConflictPanel({ convergencePoints, conflictPoints, prose }) {
  const hasStructured = (convergencePoints && convergencePoints.length > 0) || (conflictPoints && conflictPoints.length > 0);

  if (!hasStructured) {
    return prose ? (
      <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <Prose>{prose}</Prose>
      </div>
    ) : null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {convergencePoints && convergencePoints.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--emerald)25', background: 'var(--emerald-dim)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--emerald)', marginBottom: 8 }}>
            Convergence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {convergencePoints.map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>🟢</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{stripAsterisks(pt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {conflictPoints && conflictPoints.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--red)25', background: 'var(--red-dim)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>
            Conflict
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {conflictPoints.map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>🔴</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{stripAsterisks(pt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Assumptions & Missing Evidence Panel
// ─────────────────────────────────────────────────────────

function AssumptionsMissingPanel({ assumptions, missingEvidence, legacyProse }) {
  const hasStructured = (assumptions && assumptions.length > 0) || (missingEvidence && missingEvidence.length > 0);

  if (!hasStructured) {
    return legacyProse ? (
      <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <Prose>{legacyProse}</Prose>
      </div>
    ) : null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {assumptions && assumptions.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Assumptions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {assumptions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <Info size={10} style={{ color: 'var(--indigo)', flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{stripAsterisks(a)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {missingEvidence && missingEvidence.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Missing Evidence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {missingEvidence.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <HelpCircle size={10} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{stripAsterisks(m)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Ethical Assessment Card
// ─────────────────────────────────────────────────────────

function EthicalAssessmentCard({ assessment }) {
  if (!assessment || !assessment.position) return null;
  const { position, confidence, evidenceStrength, ethicalRisk, keyUncertainty } = assessment;
  const cleanPos = stripAsterisks(position);
  const cleanConf = stripAsterisks(confidence);
  const cleanEv = stripAsterisks(evidenceStrength);
  const cleanRisk = stripAsterisks(ethicalRisk);
  const cleanUnc = stripAsterisks(keyUncertainty);
  const { color, bg } = positionColors(cleanPos);
  const confColor = confidenceColor(cleanConf);
  const riskCol = riskColor(cleanRisk);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px', borderRadius: 12,
        border: `1px solid ${color}30`,
        background: bg,
      }}
    >
      {/* Position */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 4 }}>
          Ethical Position
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color }}>{cleanPos}</div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {cleanConf && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 80 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Confidence</div>
            <Chip label={cleanConf} color={confColor} />
          </div>
        )}
        {cleanEv && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 80 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Evidence</div>
            <Chip label={cleanEv} color="var(--text-muted)" />
          </div>
        )}
        {cleanRisk && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 80 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ethical Risk</div>
            <Chip label={cleanRisk} color={riskCol} />
          </div>
        )}
      </div>

      {/* Key uncertainty */}
      {cleanUnc && (
        <div style={{
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            Key Uncertainty
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cleanUnc}</div>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Safeguards List
// ─────────────────────────────────────────────────────────

function SafeguardsList({ safeguards }) {
  if (!safeguards || safeguards.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {safeguards.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}
        >
          <CheckCircle2 size={13} style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{stripAsterisks(s)}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Standard Analysis (main rendered output)
// ─────────────────────────────────────────────────────────

function StandardAnalysis({ text }) {
  const data = parseStandardResponse(text);

  // If parsing yields nothing useful, fall back to plain markdown
  if (!data || (!data.coreTension && data.frameworks.length === 0 && !data.synthesis)) {
    return (
      <div className="prose-sm" style={{ fontSize: 13, lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ① Core Ethical Tension */}
      {data.coreTension && (
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          border: '1px solid var(--amber-dim)', background: 'var(--amber-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Scale size={13} style={{ color: 'var(--amber)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)' }}>
              Core Ethical Tension
            </span>
          </div>
          <Prose>{data.coreTension}</Prose>
        </div>
      )}

      {/* ② Framework Analysis */}
      {data.frameworks.length > 0 && (
        <div>
          <SectionHeader icon={<BookOpen size={11} />} label="Framework Analysis" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.frameworks.map((fw, i) => (
              <FrameworkCard key={i} fw={fw} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ③ Stakeholder Impact */}
      {data.stakeholders && data.stakeholders.length > 0 && (
        <div>
          <SectionHeader icon={<Users size={11} />} label="Stakeholder Impact" />
          <StakeholderGrid stakeholders={data.stakeholders} />
        </div>
      )}

      {/* ④ Diagnostic Lenses */}
      {(data.lenses.precedent || data.lenses.preMortem || data.lenses.reversibility) && (
        <div>
          <SectionHeader icon={<History size={11} />} label="Diagnostic Lenses" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {data.lenses.precedent && (
              <LensCard icon={<History size={12} />} title="Historical Precedent" accentColor="var(--indigo)">
                <PrecedentTable rows={data.lenses.precedentTable} prose={data.lenses.precedentTable.length === 0 ? data.lenses.precedent : ''} />
              </LensCard>
            )}

            {data.lenses.preMortem && (
              <LensCard icon={<AlertOctagon size={12} />} title="5-Year Pre-Mortem" accentColor="var(--red)">
                <PreMortemTable rows={data.lenses.preMortemTable} prose={data.lenses.preMortemTable.length === 0 ? data.lenses.preMortem : ''} />
              </LensCard>
            )}

            {data.lenses.reversibility && (
              <LensCard icon={<Undo2 size={12} />} title="Reversibility" accentColor="var(--cyan)">
                <ReversibilityBadge score={data.lenses.reversibilityScore} prose={!data.lenses.reversibilityScore ? data.lenses.reversibility : ''} />
              </LensCard>
            )}
          </div>
        </div>
      )}

      {/* ⑤ Convergence & Conflict */}
      {(data.convergencePoints.length > 0 || data.conflictPoints.length > 0 || data.convergence) && (
        <div>
          <SectionHeader icon={<ArrowRightLeft size={11} />} label="Convergence & Conflict" />
          <ConvergenceConflictPanel
            convergencePoints={data.convergencePoints}
            conflictPoints={data.conflictPoints}
            prose={data.convergence}
          />
        </div>
      )}

      {/* ⑥ Assumptions & Missing Evidence */}
      {(data.assumptions.length > 0 || data.missingEvidence.length > 0 || data.missingInfo) && (
        <div>
          <SectionHeader icon={<AlertTriangle size={11} />} label="Assumptions & Missing Evidence" />
          <AssumptionsMissingPanel
            assumptions={data.assumptions}
            missingEvidence={data.missingEvidence}
            legacyProse={data.missingInfo}
          />
        </div>
      )}

      {/* ⑦ Ethical Assessment */}
      {data.ethicalAssessment && (
        <div>
          <SectionHeader icon={<CircleDot size={11} />} label="Ethical Assessment" />
          <EthicalAssessmentCard assessment={data.ethicalAssessment} />
        </div>
      )}

      {/* ⑧ Synthesis */}
      {data.synthesis && (
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          border: '1px solid var(--emerald-dim)', background: 'var(--emerald-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Lightbulb size={13} style={{ color: 'var(--emerald)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
              Synthesis
            </span>
          </div>
          <Prose>{data.synthesis}</Prose>
        </div>
      )}

      {/* ⑨ Safeguards Required */}
      {data.safeguards && data.safeguards.length > 0 && (
        <div>
          <SectionHeader icon={<ShieldCheck size={11} />} label="Safeguards Required" />
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            border: '1px solid var(--emerald)30', background: 'var(--bg-surface)',
          }}>
            <SafeguardsList safeguards={data.safeguards} />
          </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Council Analysis (unchanged)
// ─────────────────────────────────────────────────────────

function CouncilAnalysis({ text }) {
  const data = parseCouncilResponse(text);
  if (!data || (!data.moderatorIntro && data.dialogue.length === 0)) {
    return (
      <div className="prose-sm" style={{ fontSize: 13, lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    );
  }

  const getSpeakerColor = (speaker) => {
    const s = speaker.toLowerCase();
    if (s.includes('utilitarian')) return 'var(--amber)';
    if (s.includes('deontol')) return 'var(--indigo)';
    if (s.includes('virtue')) return 'var(--cyan)';
    if (s.includes('care')) return 'var(--emerald)';
    if (s.includes('rights')) return 'var(--red)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.moderatorIntro && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          border: '1px solid var(--amber-dim)', background: 'var(--amber-dim)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 6 }}>Moderator</div>
          <Prose>{data.moderatorIntro}</Prose>
        </div>
      )}

      {data.dialogue.length > 0 && (
        <div>
          <SectionHeader icon={<Users size={11} />} label="Council Dialogue" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.dialogue.map((d, i) => {
              const color = getSpeakerColor(d.speaker);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', gap: 10 }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${color}18`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color, fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 2,
                  }}>
                    {d.speaker.charAt(d.speaker.startsWith('The ') ? 4 : 0)}
                  </div>
                  <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 6 }}>
                      {d.speaker}
                    </div>
                    <Prose>{d.text}</Prose>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {(data.overlays.precedent || data.overlays.preMortem || data.overlays.reversibility) && (
        <div>
          <SectionHeader icon={<History size={11} />} label="Diagnostic Overlays" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.overlays.precedent && (
              <LensCard icon={<History size={12} />} title="Historical Precedent" accentColor="var(--indigo)">
                <Prose>{data.overlays.precedent}</Prose>
              </LensCard>
            )}
            {data.overlays.preMortem && (
              <LensCard icon={<AlertOctagon size={12} />} title="Pre-Mortem" accentColor="var(--red)">
                <Prose>{data.overlays.preMortem}</Prose>
              </LensCard>
            )}
            {data.overlays.reversibility && (
              <LensCard icon={<Undo2 size={12} />} title="Reversibility Check" accentColor="var(--cyan)">
                <Prose>{data.overlays.reversibility}</Prose>
              </LensCard>
            )}
          </div>
        </div>
      )}

      {data.closingMap && (
        <div style={{
          padding: '14px', borderRadius: 10,
          border: '1px solid var(--emerald-dim)', background: 'var(--emerald-dim)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--emerald)', marginBottom: 6 }}>Closing Synthesis</div>
          <Prose>{data.closingMap}</Prose>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '14px 16px' }}>
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ y: [-3, 0, -3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay, ease: 'easeInOut' }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }}
        />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Reasoning through frameworks…</span>
    </div>
  );
}

const isCouncilMode = (content) =>
  content?.toLowerCase().includes('council') ||
  content?.toLowerCase().includes('moderator') ||
  content?.toLowerCase().includes('the utilitarian');

// ─────────────────────────────────────────────────────────
// Main ChatMessage Export
// ─────────────────────────────────────────────────────────

export default function ChatMessage({ message, isStreaming, isLast }) {
  const isUser = message.role === 'user';
  const isLoading = isLast && isStreaming && !message.content;

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}
      >
        <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexDirection: 'row-reverse' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'var(--indigo-dim)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 10, fontWeight: 800, color: 'var(--indigo)',
            }}>
              U
            </div>
            <div style={{
              padding: '12px 16px', borderRadius: 14, borderTopRightRadius: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.7, maxWidth: '100%',
            }}>
              {message.content}
            </div>
          </div>
          <div style={{ paddingRight: 40 }}>
            <CopyButton text={message.content} />
          </div>
        </div>
      </motion.div>
    );
  }

  const council = isCouncilMode(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: 'var(--amber)', color: '#0d0f14',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 800, marginTop: 2,
          boxShadow: '0 2px 8px var(--amber-dim)',
        }}>
          {council ? 'C' : 'E'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
              {council ? 'Ethics Council' : 'Ethics Critic'}
            </span>
            {council && (
              <span style={{
                fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                background: 'var(--amber-dim)', color: 'var(--amber)',
                border: '1px solid rgba(245,158,11,0.2)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Council Mode
              </span>
            )}
          </div>

          {/* Message body */}
          <div style={{
            borderRadius: 14, borderTopLeftRadius: 4,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            overflow: 'hidden',
          }}>
            {isLoading ? (
              <TypingIndicator />
            ) : message.content ? (
              <div style={{ padding: '18px' }}>
                {council
                  ? <CouncilAnalysis text={message.content} />
                  : <StandardAnalysis text={message.content} />
                }
              </div>
            ) : null}
          </div>

          {/* Action row */}
          {!isLoading && message.content && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <CopyButton text={message.content} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
