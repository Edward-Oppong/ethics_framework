import { Scale, BookOpen, AlertTriangle, ShieldCheck, ArrowRight, Users, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Scale size={14} style={{ color: '#6366f1' }} />,
    tag: 'Workforce & Automation',
    title: 'Workforce AI Replacement',
    text: 'Should a company deploy generative AI to automate creative roles to save costs, even if it leads to mandatory employee layoffs?',
    council: false,
    accent: '#6366f1',
  },
  {
    icon: <BookOpen size={14} style={{ color: '#0ea5e9' }} />,
    tag: 'Autonomous Policy',
    title: 'Autonomous Vehicle Dilemma',
    text: 'How should self-driving vehicles be programmed in unavoidable accident scenarios? Passenger safety vs minimizing total casualties?',
    council: false,
    accent: '#0ea5e9',
  },
  {
    icon: <Users size={14} style={{ color: '#f59e0b' }} />,
    tag: 'Council Debate',
    title: 'Civil Disobedience',
    text: 'Is it ethically justifiable for climate activists to blockade public transportation to force government action on emissions?',
    council: true,
    accent: '#f59e0b',
  },
  {
    icon: <ShieldCheck size={14} style={{ color: '#ef4444' }} />,
    tag: 'Rights & Privacy',
    title: 'Misinformation Regulation',
    text: 'Can a democratic government ethically restrict algorithmic distribution of political speech during election periods?',
    council: false,
    accent: '#ef4444',
  },
];

const FRAMEWORK_PILLS = [
  { name: 'Utilitarianism',   id: 'utilitarianism', icon: '⚖️', color: '#6366f1', bg: '#6366f112', border: '#6366f140' },
  { name: 'Deontology',       id: 'deontology',     icon: '📜', color: '#0ea5e9', bg: '#0ea5e912', border: '#0ea5e940' },
  { name: 'Virtue Ethics',    id: 'virtue',         icon: '🛡️', color: '#10b981', bg: '#10b98112', border: '#10b98140' },
  { name: 'Care Ethics',      id: 'care',           icon: '🤝', color: '#f59e0b', bg: '#f59e0b12', border: '#f59e0b40' },
  { name: 'Rights-Based',     id: 'rights',         icon: '🔑', color: '#ef4444', bg: '#ef444412', border: '#ef444440' },
  { name: 'Justice & Fairness', id: 'justice',       icon: '🏛️', color: '#8b5cf6', bg: '#8b5cf612', border: '#8b5cf640' },
];

export default function WelcomeScreen({ onExample }) {
  return (
    <div style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 780, width: '100%', display: 'flex', flexDirection: 'column', gap: 28, textAlign: 'center' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <Scale size={22} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            AI Ethics Assistant
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.6 }}>
            Submit an ethical dilemma, policy proposal, or decision. Receive structured critiques from pluralistic ethical frameworks.
          </p>
        </div>

        {/* Framework Tags — Rich Color Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {FRAMEWORK_PILLS.map((fw, i) => (
            <button
              key={i}
              onClick={() => onExample(`Analyze the ethical implications of AI decision systems through ${fw.name}.`, false, fw.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20,
                background: fw.bg, border: `1px solid ${fw.border}`,
                color: fw.color, cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${fw.color}30`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
              }}
            >
              <span style={{ fontSize: 13 }}>{fw.icon}</span>
              <span>{fw.name}</span>
            </button>
          ))}
        </div>

        {/* Example Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Sparkles size={12} style={{ color: 'var(--text-muted)' }} />
            Select an example dilemma to begin
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => onExample(s.text, s.council)}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '16px 18px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease', minHeight: 120, position: 'relative', overflow: 'hidden'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = `${s.accent}60`;
                  e.currentTarget.style.boxShadow = `0 4px 14px ${s.accent}15`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Left accent indicator strip */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: s.accent }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: s.accent, marginBottom: 6 }}>
                    {s.icon}
                    <span>{s.tag}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {s.text}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <ArrowRight size={13} style={{ color: s.accent }} />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
