import {
  Brain, BookOpen, Scale, ChevronRight,
  Zap, MessageSquare, FolderOpen, ArrowRight, Grid
} from 'lucide-react';

export default function DashboardView({ onNavigate, onStartChat, sessions }) {
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Platform Overview
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Multi-framework ethical reasoning assistant powered by dedicated Hugging Face AI models.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onStartChat('Should AI decision models be deployed in healthcare triage?')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 6,
                  background: 'var(--accent)', color: 'var(--bg-card)',
                  fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)', transition: 'opacity 0.12s'
                }}
              >
                <Zap size={13} /> Quick Analysis
              </button>
            </div>
          </div>

          {/* Real Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: '20px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Total Inquiries Run</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
                {sessions.length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Active sessions in storage</div>
            </div>

            <div style={{ padding: '20px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Ethical Frameworks</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
                6
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Dedicated Hugging Face Models</div>
            </div>

            <div style={{ padding: '20px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>AI Provider Engine</div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Hugging Face
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Llama-3, Mistral, Qwen & Gemma</div>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
              Core Analysis Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {[
                { title: 'Decision Analyzer', desc: '5-Step structured dilemma evaluation', icon: <Brain size={16} />, route: 'analyzer' },
                { title: 'Framework Library', desc: 'Inspect core theories & invoke HF models', icon: <BookOpen size={16} />, route: 'frameworks' },
                { title: 'Compare Frameworks', desc: 'Side-by-side framework tension comparison', icon: <Scale size={16} />, route: 'comparison' },
                { title: 'Case Studies', desc: 'Real-world technological failures & lessons', icon: <Grid size={16} />, route: 'cases' },
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(q.route)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px', borderRadius: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.12s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ padding: 8, borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      {q.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{q.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{q.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Real User Inquiry History */}
          <div style={{ padding: '24px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent Inquiry History
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={() => onNavigate('history')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span>View all ({sessions.length})</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            {recentSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                No past inquiries recorded yet. Start your first ethical analysis using the AI Ethics Assistant.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onNavigate('history')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: 6,
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                      cursor: 'pointer', transition: 'all 0.12s', gap: 16
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <MessageSquare size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.title}
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
