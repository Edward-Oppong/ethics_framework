import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Grid, Download, Share2, Award, Info, BookOpen, BarChart2 } from 'lucide-react';

const LEGENDS = [
  { name: 'Utilitarianism',  color: '#2563eb' },
  { name: 'Deontology',      color: '#7c3aed' },
  { name: 'Virtue Ethics',   color: '#0d9488' },
  { name: 'Care Ethics',     color: '#dc2626' },
  { name: 'Rights-Based',    color: '#d97706' },
  { name: 'Justice',         color: '#0891b2' },
  { name: 'Contractualism',  color: '#4f46e5' },
];

export default function RightPanel({ messages, onNavigate }) {
  const [copied, setCopied] = useState(false);

  const exportMarkdown = () => {
    if (!messages.length) return;
    let md = '# Ethics Critic Analysis\n\n';
    messages.forEach(m => {
      md += m.role === 'user'
        ? `### Dilemma Prompt\n\n${m.content}\n\n---\n\n`
        : `### Analysis\n\n${m.content}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `ethics_analysis_${Date.now()}.md`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <aside style={{
      width: 250,
      flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto'
    }}>

      {/* Framework Legend */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
          Framework Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {LEGENDS.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
          Quick Access
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'Framework Library', icon: <BookOpen size={14} />, route: 'frameworks' },
            { label: 'Decision Analyzer', icon: <Brain size={14} />, route: 'analyzer' },
            { label: 'Case Studies', icon: <Grid size={14} />, route: 'cases' },
            { label: 'Dashboard Overview', icon: <BarChart2 size={14} />, route: 'home' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate(item.route)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px', borderRadius: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                textAlign: 'left', transition: 'all 0.12s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Notes */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
          System Notes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <Award size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
            <span>Structured critique maps pluralistic tensions, convergence, and friction.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
            <span>Anti-Sanitization strips buzzwords. Anti-Weaponization applies balance counterweights.</span>
          </div>
        </div>
      </div>

      {/* Export actions */}
      {messages.length > 0 && (
        <div style={{ padding: '20px 18px', marginTop: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>Export Options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={exportMarkdown}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={copyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer'
              }}
            >
              <Share2 size={13} />
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>
          </div>
        </div>
      )}

    </aside>
  );
}
