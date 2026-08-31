import { useState } from 'react';
import { Download, Share2, FileCode, Printer, Check } from 'lucide-react';

export default function RightPanel({ messages }) {
  const [copied, setCopied] = useState(false);
  const [downloadedMd, setDownloadedMd] = useState(false);
  const [downloadedJson, setDownloadedJson] = useState(false);

  const exportMarkdown = () => {
    if (!messages.length) return;
    let md = '# Ethics Critic Deliberation Transcript\n\n';
    md += `**Date:** ${new Date().toLocaleString()}\n`;
    md += `**Turns:** ${messages.length}\n\n---\n\n`;

    messages.forEach((m, idx) => {
      md += m.role === 'user'
        ? `### 👤 Dilemma / User Query (${idx + 1})\n\n${m.content}\n\n`
        : `### 🤖 Ethical Analysis & Critique (${idx + 1})\n\n${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `ethics_transcript_${Date.now()}.md`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadedMd(true);
    setTimeout(() => setDownloadedMd(false), 2000);
  };

  const exportJson = () => {
    if (!messages.length) return;
    const data = {
      app: 'Ethics Critic',
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      messages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `ethics_session_${Date.now()}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadedJson(true);
    setTimeout(() => setDownloadedJson(false), 2000);
  };

  const handlePrint = () => {
    if (!messages.length) return;
    window.print();
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
      gap: 8,
    }}>
      {/* Export Markdown */}
      <button
        onClick={exportMarkdown}
        title="Export Transcript (Markdown)"
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: downloadedMd ? 'var(--emerald-dim)' : 'none',
          border: `1px solid ${downloadedMd ? 'var(--emerald)' : 'var(--border)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: downloadedMd ? 'var(--emerald)' : 'var(--text-muted)', transition: 'all 0.12s',
        }}
        onMouseOver={e => {
          if (!downloadedMd) {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseOut={e => {
          if (!downloadedMd) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-muted)';
          }
        }}
      >
        {downloadedMd ? <Check size={13} /> : <Download size={13} />}
      </button>

      {/* Export JSON */}
      <button
        onClick={exportJson}
        title="Export Session Data (JSON)"
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: downloadedJson ? 'var(--emerald-dim)' : 'none',
          border: `1px solid ${downloadedJson ? 'var(--emerald)' : 'var(--border)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: downloadedJson ? 'var(--emerald)' : 'var(--text-muted)', transition: 'all 0.12s',
        }}
        onMouseOver={e => {
          if (!downloadedJson) {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseOut={e => {
          if (!downloadedJson) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-muted)';
          }
        }}
      >
        {downloadedJson ? <Check size={13} /> : <FileCode size={13} />}
      </button>

      {/* Print / PDF */}
      <button
        onClick={handlePrint}
        title="Print or Save as PDF"
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'none', border: '1px solid var(--border)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'all 0.12s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Printer size={13} />
      </button>

      {/* Copy Link */}
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
          }
        }}
        onMouseOut={e => {
          if (!copied) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-muted)';
          }
        }}
      >
        <Share2 size={13} />
      </button>
    </aside>
  );
}
