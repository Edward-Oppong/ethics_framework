import { Scale, BookOpen, ShieldCheck, ArrowRight, Users, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  {
    tag: 'Workforce & Automation',
    title: 'Workforce AI Replacement',
    text: 'Should a company deploy generative AI to automate creative roles to save costs, even if it leads to mandatory employee layoffs?',
    council: false,
    accent: '#6366f1',
    dim: 'rgba(99,102,241,0.07)',
    icon: Scale,
  },
  {
    tag: 'Autonomous Policy',
    title: 'Autonomous Vehicle Dilemma',
    text: 'How should self-driving vehicles be programmed in unavoidable accident scenarios? Passenger safety vs minimizing total casualties?',
    council: false,
    accent: '#0ea5e9',
    dim: 'rgba(14,165,233,0.07)',
    icon: BookOpen,
  },
  {
    tag: 'Council Debate',
    title: 'Civil Disobedience',
    text: 'Is it ethically justifiable for climate activists to blockade public transportation to force government action on emissions?',
    council: true,
    accent: '#f59e0b',
    dim: 'rgba(245,158,11,0.07)',
    icon: Users,
  },
  {
    tag: 'Rights & Privacy',
    title: 'Misinformation Regulation',
    text: 'Can a democratic government ethically restrict algorithmic distribution of political speech during election periods?',
    council: false,
    accent: '#ef4444',
    dim: 'rgba(239,68,68,0.07)',
    icon: ShieldCheck,
  },
];

const FRAMEWORK_PILLS = [
  { name: 'Utilitarianism',    id: 'utilitarianism', icon: '⚖️', color: '#6366f1' },
  { name: 'Deontology',        id: 'deontology',     icon: '📜', color: '#0ea5e9' },
  { name: 'Virtue Ethics',     id: 'virtue',         icon: '🛡️', color: '#10b981' },
  { name: 'Care Ethics',       id: 'care',           icon: '🤝', color: '#f59e0b' },
  { name: 'Rights-Based',      id: 'rights',         icon: '🔑', color: '#ef4444' },
  { name: 'Justice & Fairness', id: 'justice',       icon: '🏛️', color: '#8b5cf6' },
];

export default function WelcomeScreen({ onExample }) {
  return (
    <div style={{
      flex: '1 1 0%', minHeight: 0, overflowY: 'auto',
      padding: '48px 24px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: '100%',
    }}>
      <div style={{
        maxWidth: 1040, width: '100%',
        display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'center',
      }}>

        {/* Brand Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Gradient icon mark */}
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
          }}>
            <Scale size={26} color="#fff" />
          </div>

          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em',
              color: 'var(--text-primary)', lineHeight: 1.15,
            }}>
              AI Ethics Assistant
            </h1>
            <p style={{
              fontSize: 13.5, color: 'var(--text-secondary)',
              maxWidth: 520, lineHeight: 1.65, marginTop: 8, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Submit an ethical dilemma, policy proposal, or decision scenario.
              Receive structured critique from pluralistic ethical frameworks.
            </p>
          </div>
        </div>

        {/* Framework Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 7 }}>
          {FRAMEWORK_PILLS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => onExample(
                `Analyze the ethical implications of AI decision systems through ${fw.name}.`,
                false,
                fw.id,
              )}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20,
                background: fw.color + '12',
                border: `1px solid ${fw.color}35`,
                color: fw.color, cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 18px ${fw.color}28`;
                e.currentTarget.style.borderColor = fw.color + '70';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = fw.color + '35';
              }}
            >
              <span style={{ fontSize: 13 }}>{fw.icon}</span>
              <span>{fw.name}</span>
            </button>
          ))}
        </div>

        {/* Example Dilemma Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)',
            textAlign: 'center', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}>
            <Sparkles size={11} />
            Select a dilemma to begin
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 10 }}>
            {SUGGESTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => onExample(s.text, s.council)}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    padding: '16px 18px', borderRadius: 10,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s ease',
                    position: 'relative', overflow: 'hidden',
                    gap: 10,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = s.accent + '55';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${s.accent}14`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = s.dim;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    background: `linear-gradient(to bottom, ${s.accent}, ${s.accent}80)`,
                  }} />

                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 10.5, fontWeight: 700, color: s.accent, marginBottom: 5,
                      letterSpacing: '0.04em',
                    }}>
                      <Icon size={13} style={{ color: s.accent }} />
                      <span>{s.tag}</span>
                    </div>
                    <div style={{
                      fontSize: 13.5, fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: 5,
                      letterSpacing: '-0.01em', lineHeight: 1.3,
                    }}>
                      {s.title}
                    </div>
                    <div style={{
                      fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.55,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {s.text}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ArrowRight size={13} style={{ color: s.accent }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
