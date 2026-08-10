import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseStandardResponse, parseCouncilResponse } from '../utils/responseParser.js';
import {
  Scale, History, AlertOctagon, Undo2, ArrowRightLeft,
  ChevronDown, ChevronUp, Copy, Check, Gauge, Users,
  BookOpen, Lightbulb, AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

function MeterBar({ label, icon, value, color = 'var(--amber)' }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {icon}
          <span>{label}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 4, width: '100%', borderRadius: 99, background: 'var(--bg-surface)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ height: '100%', borderRadius: 99, background: color }}
        />
      </div>
    </div>
  );
}

function FrameworkCard({ fw, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{fw.name}</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
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
            <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--border)' }}>
              <div className="prose-sm" style={{ marginTop: 10 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{fw.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LensCard({ icon, title, content, accentColor = 'var(--amber)' }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      border: `1px solid ${accentColor}25`,
      background: `${accentColor}08`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ color: accentColor }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor }}>
          {title}
        </span>
      </div>
      <div className="prose-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

function StandardAnalysis({ text }) {
  const data = parseStandardResponse(text);
  if (!data || (!data.coreTension && data.frameworks.length === 0)) {
    return (
      <div className="prose-sm" style={{ fontSize: 13, lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    );
  }

  const conflictCount = (data.convergence.match(/(conflict|clash|oppose|friction)/gi) || []).length;
  const consensusPercent = Math.max(10, Math.min(95, 90 - conflictCount * 15));
  const isOneWay = text.toLowerCase().includes('one-way') || text.toLowerCase().includes('irreversible');
  const reversPercent = isOneWay ? 25 : 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Meters */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '14px',
        borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)',
      }}>
        <MeterBar
          label="Ethical Consensus"
          icon={<Gauge size={10} />}
          value={consensusPercent}
          color={consensusPercent > 65 ? 'var(--emerald)' : consensusPercent > 40 ? 'var(--amber)' : 'var(--red)'}
        />
        <MeterBar
          label="Reversibility"
          icon={<Undo2 size={10} />}
          value={reversPercent}
          color={reversPercent > 60 ? 'var(--emerald)' : 'var(--red)'}
        />
      </div>

      {/* Core Tension */}
      {data.coreTension && (
        <div style={{
          padding: '14px', borderRadius: 10,
          border: '1px solid var(--amber-dim)', background: 'var(--amber-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Scale size={13} style={{ color: 'var(--amber)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)' }}>Core Tension</span>
          </div>
          <div className="prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.coreTension}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Frameworks */}
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

      {/* Diagnostic Lenses */}
      {(data.lenses.precedent || data.lenses.preMortem || data.lenses.reversibility) && (
        <div>
          <SectionHeader icon={<History size={11} />} label="Diagnostic Lenses" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.lenses.precedent && (
              <LensCard icon={<History size={12} />} title="Historical Precedent" content={data.lenses.precedent} accentColor="var(--indigo)" />
            )}
            {data.lenses.preMortem && (
              <LensCard icon={<AlertOctagon size={12} />} title="Pre-Mortem" content={data.lenses.preMortem} accentColor="var(--red)" />
            )}
            {data.lenses.reversibility && (
              <LensCard icon={<Undo2 size={12} />} title="Reversibility Check" content={data.lenses.reversibility} accentColor="var(--cyan)" />
            )}
          </div>
        </div>
      )}

      {/* Convergence */}
      {data.convergence && (
        <div>
          <SectionHeader icon={<ArrowRightLeft size={11} />} label="Convergence & Conflict" />
          <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <div className="prose-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.convergence}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Missing Info */}
      {data.missingInfo && (
        <div>
          <SectionHeader icon={<AlertTriangle size={11} />} label="Assumptions & Missing Info" />
          <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <div className="prose-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.missingInfo}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Synthesis */}
      {data.synthesis && (
        <div style={{
          padding: '14px', borderRadius: 10,
          border: '1px solid var(--emerald-dim)', background: 'var(--emerald-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Lightbulb size={13} style={{ color: 'var(--emerald)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--emerald)' }}>Synthesis</span>
          </div>
          <div className="prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.synthesis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function CouncilAnalysis({ text }) {
  const data = parseCouncilResponse(text);
  if (!data || (!data.moderatorIntro && data.dialogue.length === 0)) {
    return (
      <div className="prose-sm" style={{ fontSize: 13, lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    );
  }

  const SPEAKER_COLORS = {
    utilitarian: 'var(--amber)',
    deontologist: 'var(--indigo)',
    virtue: 'var(--cyan)',
    care: 'var(--emerald)',
    rights: 'var(--red)',
  };

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
          <div className="prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.moderatorIntro}</ReactMarkdown>
          </div>
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
                    <div className="prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{d.text}</ReactMarkdown>
                    </div>
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
              <LensCard icon={<History size={12} />} title="Historical Precedent" content={data.overlays.precedent} accentColor="var(--indigo)" />
            )}
            {data.overlays.preMortem && (
              <LensCard icon={<AlertOctagon size={12} />} title="Pre-Mortem" content={data.overlays.preMortem} accentColor="var(--red)" />
            )}
            {data.overlays.reversibility && (
              <LensCard icon={<Undo2 size={12} />} title="Reversibility Check" content={data.overlays.reversibility} accentColor="var(--cyan)" />
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
          <div className="prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.closingMap}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function ChatMessage({ message, isStreaming, isLast }) {
  const isUser = message.role === 'user';
  const isLoading = isLast && isStreaming && !message.content;

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}
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
              fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, maxWidth: '100%',
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
      style={{ marginBottom: 16 }}
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
              <div style={{ padding: '16px' }}>
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
