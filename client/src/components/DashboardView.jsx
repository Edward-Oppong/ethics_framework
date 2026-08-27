import {
  Brain, BookOpen, Scale, ChevronRight,
  Zap, MessageSquare, Grid, TrendingUp, Users,
} from 'lucide-react';

const TOOLS = [
  {
    title: 'Decision Analyzer',
    desc: '5-step structured dilemma evaluation',
    icon: Brain,
    route: 'analyzer',
    color: '#6366f1',
    dim: 'rgba(99,102,241,0.1)',
  },
  {
    title: 'Framework Library',
    desc: 'Browse & invoke dedicated AI models per framework',
    icon: BookOpen,
    route: 'frameworks',
    color: '#0ea5e9',
    dim: 'rgba(14,165,233,0.1)',
  },
  {
    title: 'Compare Frameworks',
    desc: 'Side-by-side tension mapping',
    icon: TrendingUp,
    route: 'comparison',
    color: '#10b981',
    dim: 'rgba(16,185,129,0.1)',
  },
  {
    title: 'Ethics Council',
    desc: 'Multi-persona philosophical debate',
    icon: Users,
    route: 'council',
    color: '#f59e0b',
    dim: 'rgba(245,158,11,0.1)',
  },
  {
    title: 'Case Studies',
    desc: 'Real-world tech failures & lessons',
    icon: Grid,
    route: 'cases',
    color: '#8b5cf6',
    dim: 'rgba(139,92,246,0.1)',
  },
];

export default function DashboardView({ onNavigate, onStartChat, sessions }) {
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em',
                color: 'var(--text-primary)', lineHeight: 1.2,
              }}>
                Good morning ☀️
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.5 }}>
                Pick a tool or start a new ethical analysis.
              </p>
            </div>

            <button
              onClick={() => onStartChat('Should AI decision models be deployed in healthcare triage?')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 8,
                background: 'var(--accent-gradient)', color: '#fff',
                fontSize: 12.5, fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <Zap size={13} /> Quick Analysis
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { label: 'Analyses Run', value: sessions.length, sub: 'stored locally', color: '#6366f1' },
              { label: 'Frameworks', value: 6, sub: 'pluralistic coverage', color: '#10b981' },
              { label: 'AI Engine', value: 'Groq', sub: 'Llama-3.3 / Mixtral', color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '18px 20px', borderRadius: 10,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                borderTop: `3px solid ${stat.color}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: typeof stat.value === 'number' ? 30 : 18,
                  fontWeight: 800, letterSpacing: '-0.03em',
                  color: 'var(--text-primary)', lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12,
            }}>
              Analysis Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {TOOLS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.route}
                    onClick={() => onNavigate(q.route)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: 9,
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                      boxShadow: 'var(--shadow-sm)', transition: 'all 0.13s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = q.color + '70';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${q.color}18`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: q.dim, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} style={{ color: q.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{q.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{q.desc}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent History */}
          <div style={{
            padding: '22px 24px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Inquiries
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={() => onNavigate('history')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 500, color: 'var(--indigo)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  View all ({sessions.length}) →
                </button>
              )}
            </div>

            {recentSessions.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '28px 16px',
                color: 'var(--text-muted)', fontSize: 13,
              }}>
                No analyses yet — start your first inquiry above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentSessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => onNavigate('history')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 7,
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                      cursor: 'pointer', transition: 'all 0.12s', gap: 16,
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.background = 'var(--bg-card)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-primary)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <MessageSquare size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
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
