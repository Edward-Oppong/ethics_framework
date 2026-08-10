import { User, Star, BookOpen, MessageSquare, Scale, Trophy, Settings, ArrowRight } from 'lucide-react';

const SAVED = [
  { title: 'AI Hiring Ethics Analysis', score: 74, fw: 'Deontology', risk: 'High' },
  { title: 'Climate Activist Dilemma',  score: 88, fw: 'Council Mode', risk: 'Low' },
  { title: 'Autonomous Vehicle Ethics', score: 65, fw: 'Utilitarianism', risk: 'Medium' },
];

const STATS = [
  { label: 'Analyses', value: '47', icon: <Scale size={18} /> },
  { label: 'Chats', value: '30', icon: <MessageSquare size={18} /> },
  { label: 'Saved', value: '12', icon: <Star size={18} /> },
  { label: 'Experience', value: '750 XP', icon: <Trophy size={18} /> },
];

export default function ProfileView({ onNavigate }) {
  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Profile Card */}
          <div style={{
            padding: '28px', borderRadius: 16,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: 'var(--accent-light)', border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontSize: 28, fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Serif Display, serif'
            }}>
              E
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Ethics Scholar</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>scholar@ethics.ai · Principal Ethicist, Global AI Alliance</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Exploring pluralistic ethical frameworks through AI-assisted structured critique since 2024.
              </p>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
                borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)',
                fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Settings size={13} /> Edit Profile
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '20px', borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 10
              }}>
                <span style={{ color: 'var(--accent)' }}>{s.icon}</span>
                <div className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Saved Analyses */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="font-serif" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Saved Analyses</h3>
              <button
                onClick={() => onNavigate('saved')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            {SAVED.map((item, i) => (
              <div key={i} style={{
                padding: '14px 22px', borderBottom: i < SAVED.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                cursor: 'pointer', transition: 'background 0.12s'
              }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.fw}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{item.risk}</span>
                  <span className="font-serif" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{item.score}<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</span></span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 className="font-serif" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Certifications Earned</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, background: 'var(--accent-light)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 24 }}>📜</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Ethical Theory Foundations</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Completed June 2026 · Ethics Critic Platform</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
