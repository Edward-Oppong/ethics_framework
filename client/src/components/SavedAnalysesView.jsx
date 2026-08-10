import { useState } from 'react';
import { Search, Star, Trash2, ArrowRight, Download, Tag } from 'lucide-react';

const STATIC_SAVED = [
  {
    id: 'saved_1',
    title: 'AI Recruiting & Algorithmic Fairness Audit',
    dilemma: 'Should a corporate recruiting tool use resume-scanning algorithms trained on historical data showing high gender disparities in engineering fields?',
    outcome: 'OPPOSE — Deontology & Justice',
    score: 84, date: 'July 14, 2026', tags: ['AI Bias', 'Recruiting', 'Deontology']
  },
  {
    id: 'saved_2',
    title: 'Climate Activism & Public Disobedience',
    dilemma: 'Is it ethical for environmental groups to coordinate blocking public transport to pressure municipal governments on emissions regulations?',
    outcome: 'SUPPORT — Utilitarianism',
    score: 72, date: 'July 12, 2026', tags: ['Climate', 'Protest', 'Utility']
  },
  {
    id: 'saved_3',
    title: 'Facial Recognition in Public Spaces',
    dilemma: 'Should cities deploy facial recognition surveillance in high-crime districts to reduce violent crime, even against public consent?',
    outcome: 'OPPOSE — Rights-Based & Autonomy',
    score: 61, date: 'July 10, 2026', tags: ['Privacy', 'Rights', 'Surveillance']
  },
];

export default function SavedAnalysesView({ onNavigate }) {
  const [search, setSearch] = useState('');

  const filtered = STATIC_SAVED.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div>
            <h1 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>Saved Analyses</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              Your personal library of bookmarked ethical critiques and dilemma analyses.
            </p>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search saved analyses or tags..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }}
            />
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(item => (
              <div key={item.id} style={{
                padding: '22px', borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s ease'
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>{item.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{item.dilemma}</p>
                  </div>
                  <div className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                    {item.score}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid transparent' }}>
                      {item.outcome}
                    </span>
                    {item.tags.map(t => (
                      <span key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                    <span>{item.date}</span>
                    <button style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
