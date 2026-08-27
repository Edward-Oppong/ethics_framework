import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';

export default function RightPanel({ messages }) {
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

  if (!messages.length) return null;

  return (
    <aside style={{
      width: 48,
      flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 12,
      gap: 6,
    }}>
      <button
        onClick={exportMarkdown}
        title="Export as Markdown"
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'none', border: '1px solid var(--border)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'all 0.12s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        <Download size={13} />
      </button>

      <button
        onClick={copyLink}
        title={copied ? 'Link copied!' : 'Copy share link'}
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: copied ? 'var(--emerald-dim)' : 'none',
          border: `1px solid ${copied ? 'var(--emerald)' : 'var(--border)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: copied ? 'var(--emerald)' : 'var(--text-muted)',
          transition: 'all 0.12s',
        }}
        onMouseOver={e => {
          if (!copied) {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }
        }}
        onMouseOut={e => {
          if (!copied) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
      >
        <Share2 size={13} />
      </button>
    </aside>
  );
}
