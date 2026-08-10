import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: 'The Therac-25 Radiation Disasters',
    year: '1985–1987',
    category: 'Technology Ethics',
    tags: ['Healthcare', 'Software', 'Safety'],
    summary: 'A radiation therapy device malfunctioned due to race conditions in software and lack of hardware interlocks, causing lethal radiation overdoses.',
    outcome: 'Six patients were severely overdosed; at least three died. The case became the canonical example in software engineering ethics, proving that software alone cannot replace hardware safety mechanisms.',
    lessons: [
      'Software is not a reliable substitute for physical safety interlocks.',
      'Race conditions and concurrency bugs can have fatal real-world consequences.',
      'Medical device safety requires rigorous independent software audits.'
    ],
    frameworks: ['Deontology', 'Rights-Based', 'Virtue Ethics'],
  },
  {
    id: 2,
    title: 'Volkswagen Emissions Scandal',
    year: '2015',
    category: 'Corporate Ethics',
    tags: ['Environment', 'Deception', 'Governance'],
    summary: 'Volkswagen intentionally programmed diesel engines to activate emissions controls only during laboratory testing, emitting up to 40x legal limits during real driving.',
    outcome: 'VW paid over $30 billion in fines and recalls. The scandal severely damaged corporate reputation and triggered sweeping EU vehicle regulation reforms.',
    lessons: [
      'Algorithmic deception concealed across years reveals organizational governance failure.',
      'Whistleblowing infrastructure must be treated as a core risk management asset.',
      'Short-term financial targets must never override environmental compliance.'
    ],
    frameworks: ['Contractualism', 'Justice', 'Consequentialism'],
  },
  {
    id: 3,
    title: 'Facebook–Cambridge Analytica',
    year: '2018',
    category: 'Data Sovereignty',
    tags: ['Privacy', 'Democracy', 'Micro-targeting'],
    summary: 'Cambridge Analytica harvested personal data from 87 million Facebook users without consent via a quiz app, building psychographic profiles for political micro-targeting.',
    outcome: 'Facebook was fined $5 billion by the FTC. The scandal catalyzed global GDPR enforcement and reshaped public expectations for personal data rights.',
    lessons: [
      'Platform API openness without ethical oversight is an existential risk.',
      'Consent to share data with one app does not grant rights for downstream political manipulation.',
      'Scale amplifies both platform benefits and systemic exploitation.'
    ],
    frameworks: ['Rights-Based', 'Contractualism', 'Justice'],
  },
  {
    id: 4,
    title: 'Tuskegee Syphilis Study',
    year: '1932–1972',
    category: 'Research Ethics',
    tags: ['Medicine', 'Informed Consent', 'Human Rights'],
    summary: 'The U.S. Public Health Service tracked the natural progression of untreated syphilis in 600 African American men, withholding penicillin after it became the proven cure in 1947.',
    outcome: 'Led to the 1979 Belmont Report and established modern Institutional Review Boards (IRBs) governing all human subject research worldwide.',
    lessons: [
      'Informed consent and participant autonomy must be absolute.',
      'Vulnerable populations must never be exploited for scientific progress.',
      'Research ethics requires continuous external institutional oversight.'
    ],
    frameworks: ['Justice', 'Rights-Based', 'Care Ethics'],
  }
];

export default function CaseStudiesView({ onSendToChat }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Case Studies
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Landmark real-world ethical dilemmas, corporate scandals, and technological failures that reshaped governance.
            </p>
          </div>

          {/* Grid of Cards with Breathing Room */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {CASES.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(c)}
                style={{
                  padding: '24px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      {c.category}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {c.year}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {c.summary}
                  </p>
                </div>

                <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.tags.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Details <ArrowRight size={13} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Modal Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: '#000' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'relative', width: '100%', maxWidth: 640,
                background: 'var(--bg-card)', borderRadius: 12,
                border: '1px solid var(--border)', overflow: 'hidden',
                boxShadow: 'var(--shadow-md)', zIndex: 10,
                display: 'flex', flexDirection: 'column', maxHeight: '85vh'
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.title}</h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{selected.category} · {selected.year}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Summary</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{selected.summary}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Historical Outcome</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.outcome}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Key Ethical Lessons</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selected.lessons.map((l, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onSendToChat(`Analyze the ethical lessons of ${selected.title} (${selected.year}).`);
                    setSelected(null);
                  }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'var(--bg-card)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Analyze in Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
