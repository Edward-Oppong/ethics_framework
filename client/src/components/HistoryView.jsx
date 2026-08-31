import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Trash2, MessageSquare, Clock, ArrowRight, Download, Upload, FileCode, FileText } from 'lucide-react';

export default function HistoryView({ sessions, onLoad, onDelete, onNavigate, onImportSessions }) {
  const [search, setSearch] = useState('');
  const fileInputRef = useRef(null);

  const filtered = sessions.filter(s =>
    (s.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const exportAllJson = () => {
    if (!sessions.length) return;
    const data = {
      app: 'Ethics Critic',
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      sessionsCount: sessions.length,
      sessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `ethics_history_backup_${Date.now()}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportSessionMd = (e, s) => {
    e.stopPropagation();
    if (!s.messages?.length) return;
    let md = `# Ethics Critic — ${s.title}\n\n`;
    md += `**Date:** ${new Date(s.updatedAt || s.createdAt).toLocaleString()}\n`;
    md += `**Turns:** ${s.messages.length}\n\n---\n\n`;

    s.messages.forEach((m, idx) => {
      md += m.role === 'user'
        ? `### 👤 Inquiry (${idx + 1})\n\n${m.content}\n\n`
        : `### 🤖 Ethical Analysis (${idx + 1})\n\n${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `session_${s.id}_${Date.now()}.md`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportSessionJson = (e, s) => {
    e.stopPropagation();
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `session_${s.id}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const importedSessions = Array.isArray(parsed)
          ? parsed
          : (parsed.sessions || [parsed]);

        if (onImportSessions) {
          onImportSessions(importedSessions);
        }
      } catch (err) {
        alert('Invalid JSON file. Please ensure it is a valid Ethics Critic backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

          {/* Header & Global Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>Inquiry History</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Browse, search, backup, or restore your past ethical analyses and council debates.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Upload size={13} /> Import Backup (.json)
              </button>

              {sessions.length > 0 && (
                <button
                  onClick={exportAllJson}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <Download size={13} /> Export All ({sessions.length})
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search past inquiries and analyses..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }}
            />
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              {sessions.length === 0 ? 'No inquiry history yet. Start your first ethical analysis.' : 'No matching inquiries found.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {filtered.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-interactive"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px', borderRadius: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => { onLoad(s.id); onNavigate('chat'); }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageSquare size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                          {new Date(s.updatedAt || s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>·</span>
                        <span className="badge-framework">{s.messages?.length || 0} Deliberation Steps</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={e => exportSessionMd(e, s)}
                        style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Export as Markdown"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={e => exportSessionJson(e, s)}
                        style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Export as JSON"
                      >
                        <FileCode size={14} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                        style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.15s ease' }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Delete session"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
