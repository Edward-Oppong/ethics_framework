import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, Clock, Trophy } from 'lucide-react';

const COURSES = [
  {
    id: 1, title: 'Foundations of Ethical Theory',
    desc: 'A comprehensive primer on the major ethical traditions, historical origins, and core principles.',
    lessons: 12, duration: '4h 30m', difficulty: 'Beginner', progress: 100,
    locked: false,
  },
  {
    id: 2, title: 'Deontology in Practice',
    desc: 'Apply Kantian ethics and categorical imperatives to modern dilemmas in technology and governance.',
    lessons: 9, duration: '3h 15m', difficulty: 'Intermediate', progress: 65,
    locked: false,
  },
  {
    id: 3, title: 'AI Ethics & Algorithmic Fairness',
    desc: 'Navigate bias, accountability, and transparency in AI systems using pluralistic ethical frameworks.',
    lessons: 15, duration: '6h 00m', difficulty: 'Advanced', progress: 30,
    locked: false,
  },
  {
    id: 4, title: 'Care Ethics & Relational Responsibility',
    desc: 'Explore feminist bioethics, vulnerability, and relationship-centered moral frameworks.',
    lessons: 8, duration: '2h 45m', difficulty: 'Intermediate', progress: 0,
    locked: true,
  },
];

export default function LearningHub() {
  const [activeCourse, setActiveCourse] = useState(null);

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Learning Hub
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Master ethical theory, moral reasoning, and technology governance through structured learning modules.
              </p>
            </div>

            {/* Streak & XP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>750</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total XP</div>
              </div>
              <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>1</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</div>
              </div>
              <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>3 Days</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Streak</div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {COURSES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                onClick={() => !c.locked && setActiveCourse(c)}
                style={{
                  padding: '24px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  cursor: c.locked ? 'not-allowed' : 'pointer',
                  opacity: c.locked ? 0.6 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      {c.difficulty}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {c.duration}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{c.title}</span>
                    {c.progress === 100 && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                    {c.locked && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {c.desc}
                  </p>
                </div>

                {/* Progress Bar */}
                <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>{c.lessons} Lessons</span>
                    <span>{c.progress}% Complete</span>
                  </div>
                  <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--text-primary)', transition: 'width 0.3s' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
