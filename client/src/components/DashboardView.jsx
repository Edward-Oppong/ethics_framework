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
                fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em',
                color: 'var(--text-primary)', lineHeight: 1.2,
              }}>
                Ethics Deliberation Workspace
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.5 }}>
                Multi-framework ethical reasoning, algorithmic critique & council deliberation.
              </p>
            </div>

            <button
              onClick={() => onStartChat('Should autonomous AI triage decisions in healthcare override patient preferences under extreme scarcity?')}
              className="btn-primary"
              style={{
                padding: '9px 18px', borderRadius: 8,
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Zap size={14} /> Quick Deliberation
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { label: 'Analyses Run', value: sessions.length, sub: 'Stored in secure session memory', color: 'var(--accent)' },
              { label: 'Philosophical Lenses', value: '7 Schools', sub: 'Utilitarian, Deontological, Care, etc.', color: 'var(--color-slate)' },
              { label: 'Deliberation Engine', value: 'Active', sub: 'Multi-Perspective AI Reasoning', color: 'var(--color-rust)' },
            ].map((stat, i) => (
              <div key={i} className="card-interactive" style={{
                padding: '18px 20px', borderRadius: 10,
                borderTop: `3px solid ${stat.color}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: typeof stat.value === 'number' ? 28 : 20,
                  fontWeight: 800, letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', lineHeight: 1.1,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12,
            }}>
              Core Deliberation Suites
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {TOOLS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.route}
                    onClick={() => onNavigate(q.route)}
                    className="card-interactive"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: 9,
                      color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={17} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{q.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{q.desc}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent History */}
          <div className="card-interactive" style={{
            padding: '22px 24px', borderRadius: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Deliberations
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={() => onNavigate('history')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, color: 'var(--accent)',
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
