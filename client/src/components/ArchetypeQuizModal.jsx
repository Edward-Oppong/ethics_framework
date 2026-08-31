// ============================================================
//  Ethics Critic — Ethical Archetype Finder (Interactive Mini-Quiz)
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, ArrowRight, RotateCcw, CheckCircle2, Award } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'A runaway train is heading toward 5 workers. Pulling a lever diverts it to a track with 1 worker.',
    options: [
      { text: 'Pull the lever: Saving 5 lives outweighs the loss of 1 life.', weights: { utilitarian: 9, deontology: 2, virtue: 5, care: 3, rights: 2, pragmatism: 8 } },
      { text: 'Do not pull: Actively choosing to kill an innocent person violates a moral duty.', weights: { utilitarian: 2, deontology: 10, virtue: 6, care: 4, rights: 9, pragmatism: 3 } },
      { text: 'Look for a third adaptive way to derail the train or alert the workers.', weights: { utilitarian: 5, deontology: 4, virtue: 7, care: 6, rights: 5, pragmatism: 10 } },
      { text: 'Consider who is on the tracks and how their families and loved ones will cope.', weights: { utilitarian: 4, deontology: 3, virtue: 6, care: 10, rights: 4, pragmatism: 5 } }
    ]
  },
  {
    id: 2,
    question: 'Should a corporate whistleblower leak secret documents exposing company harm if they signed a legally binding NDA?',
    options: [
      { text: 'Leak immediately: Public welfare and harm prevention supersede corporate contracts.', weights: { utilitarian: 9, deontology: 5, virtue: 7, care: 6, rights: 8, pragmatism: 7 } },
      { text: 'Uphold the promise: Contractual promises and legal duties must remain inviolable.', weights: { utilitarian: 2, deontology: 9, virtue: 4, care: 3, rights: 6, pragmatism: 2 } },
      { text: 'Follow internal escalation and whistleblowing channels iteratively first.', weights: { utilitarian: 6, deontology: 6, virtue: 8, care: 5, rights: 5, pragmatism: 10 } },
      { text: 'Protect vulnerable colleagues from company retaliation before acting.', weights: { utilitarian: 5, deontology: 4, virtue: 6, care: 10, rights: 6, pragmatism: 7 } }
    ]
  },
  {
    id: 3,
    question: 'During a severe global pandemic, should government mandate vaccination for all citizens?',
    options: [
      { text: 'Yes, mandatory: Herd immunity and collective survival take precedence over individual liberty.', weights: { utilitarian: 10, deontology: 3, virtue: 5, care: 7, rights: 2, pragmatism: 8 } },
      { text: 'No, voluntary only: Bodily autonomy is an inalienable right that must not be violated.', weights: { utilitarian: 3, deontology: 8, virtue: 4, care: 3, rights: 10, pragmatism: 3 } },
      { text: 'Implement tiered incentives, testing alternatives, and educational campaigns.', weights: { utilitarian: 6, deontology: 5, virtue: 7, care: 6, rights: 6, pragmatism: 10 } },
      { text: 'Provide compassionate community care for those hesitant or vulnerable.', weights: { utilitarian: 5, deontology: 4, virtue: 7, care: 10, rights: 5, pragmatism: 6 } }
    ]
  },
  {
    id: 4,
    question: 'What defines a truly admirable and good leader in a time of crisis?',
    options: [
      { text: 'The ability to make tough, ruthless trade-offs that maximize the greatest total outcome.', weights: { utilitarian: 10, deontology: 3, virtue: 5, care: 2, rights: 4, pragmatism: 7 } },
      { text: 'Uncompromising integrity, honesty, and adherence to universal moral principles.', weights: { utilitarian: 2, deontology: 10, virtue: 9, care: 5, rights: 8, pragmatism: 3 } },
      { text: 'Deep empathy, relational warmth, and unwavering protection for the most vulnerable.', weights: { utilitarian: 3, deontology: 4, virtue: 7, care: 10, rights: 5, pragmatism: 4 } },
      { text: 'Practical wisdom, agility, experimentation, and learning from failure.', weights: { utilitarian: 6, deontology: 4, virtue: 8, care: 5, rights: 4, pragmatism: 10 } }
    ]
  }
];

const ARCHETYPES = {
  deontology: {
    title: 'The Principled Guardian',
    subtitle: 'Deontological / Kantian Alignment',
    icon: '📜',
    color: '#0ea5e9',
    description: 'You believe in unwavering moral duties, human dignity, and universal rules. To you, people must never be treated merely as tools or numbers for someone else’s benefit.',
    strength: 'Unshakeable integrity and fierce protection of human rights against expediency.',
    blindspot: 'Risk of moral rigidity when rules clash in complex emergency situations.'
  },
  utilitarian: {
    title: 'The Systematic Optimizer',
    subtitle: 'Utilitarian / Consequentialist Alignment',
    icon: '⚖️',
    color: 'var(--color-terracotta)',
    description: 'You focus squarely on outcomes, welfare, and harm reduction. You are willing to make uncomfortable trade-offs if it measurably saves more lives and reduces suffering.',
    strength: 'Clear, rational, and numerate decision-making in large-scale resource allocation.',
    blindspot: 'May accidentally overlook severe localized harms inflicted on minority groups.'
  },
  care: {
    title: 'The Compassionate Steward',
    subtitle: 'Care Ethics Alignment',
    icon: '🤝',
    color: '#f59e0b',
    description: 'You prioritize real human relationships, empathy, and safeguarding the vulnerable. You reject sterile calculations and demand attention to real human pain and trust.',
    strength: 'Deep relational attunement, conflict healing, and moral compassion.',
    blindspot: 'Can struggle with impersonal institutional policy requiring detached standardization.'
  },
  pragmatism: {
    title: 'The Adaptive Architect',
    subtitle: 'Pragmatic Ethics & Experimentalism',
    icon: '💡',
    color: '#ec4899',
    description: 'You view ethics as dynamic problem-solving. Rather than dogmatic ideological purity, you look for workable harmonies, adaptive iterations, and real-world results.',
    strength: 'High resilience, innovative solutions, and value reconciliation in fast-changing tech crises.',
    blindspot: 'Risk of slipping into unanchored moral relativism if fundamental boundaries are not defined.'
  },
  virtue: {
    title: 'The Wise Statesperson',
    subtitle: 'Virtue Ethics & Phronesis',
    icon: '🛡️',
    color: '#10b981',
    description: 'You focus on moral character, courage, and flourishing. You ask what kind of person or culture an action creates over time.',
    strength: 'Cultivates deep practical wisdom, balance (The Golden Mean), and honorable leadership.',
    blindspot: 'Lacks immediate mechanical decision algorithms for novel automated dilemmas.'
  }
};

export default function ArchetypeQuizModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ utilitarian: 0, deontology: 0, virtue: 0, care: 0, rights: 0, pragmatism: 0 });
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSelectOption = (weights) => {
    const updated = { ...scores };
    Object.entries(weights).forEach(([k, v]) => {
      updated[k] = (updated[k] || 0) + v;
    });
    setScores(updated);

    if (currentStep + 1 < QUIZ_QUESTIONS.length) {
      setCurrentStep(s => s + 1);
    } else {
      // Calculate top archetype
      let topKey = 'deontology';
      let maxScore = -1;
      Object.entries(updated).forEach(([k, v]) => {
        if (v > maxScore && ARCHETYPES[k]) {
          maxScore = v;
          topKey = k;
        }
      });
      setResult(ARCHETYPES[topKey] || ARCHETYPES.deontology);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({ utilitarian: 0, deontology: 0, virtue: 0, care: 0, rights: 0, pragmatism: 0 });
    setResult(null);
  };

  const radarData = [
    { subject: 'Duty (Deont)', value: scores.deontology },
    { subject: 'Utility (Outcomes)', value: scores.utilitarian },
    { subject: 'Virtue (Character)', value: scores.virtue },
    { subject: 'Care (Relational)', value: scores.care },
    { subject: 'Rights (Autonomy)', value: scores.rights },
    { subject: 'Pragmatic (Action)', value: scores.pragmatism },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 580,
          background: 'var(--bg-card)', borderRadius: 14,
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)', zIndex: 10,
          display: 'flex', flexDirection: 'column', maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Ethical Archetype Finder</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Discover your intuitive moral reasoning profile</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!result ? (
            <>
              {/* Progress */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                <span>QUESTION {currentStep + 1} OF {QUIZ_QUESTIONS.length}</span>
                <div style={{ width: 120, height: 4, borderRadius: 99, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                  <div style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>

              {/* Question */}
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
                {QUIZ_QUESTIONS[currentStep].question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.weights)}
                    className="card-interactive"
                    style={{
                      padding: '14px 16px', borderRadius: 8, textAlign: 'left',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
                    }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Result Screen */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{result.icon}</div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: result.color }}>
                  Your Primary Archetype
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  {result.title}
                </h2>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{result.subtitle}</p>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'left' }}>
                {result.description}
              </p>

              {/* Radar Breakdown */}
              <div style={{ height: 180, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} />
                    <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left' }}>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: 4 }}>Core Strength</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{result.strength}</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>Blindspot Risk</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{result.blindspot}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
                <button
                  onClick={handleReset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)',
                    color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={13} /> Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary"
                  style={{ padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
