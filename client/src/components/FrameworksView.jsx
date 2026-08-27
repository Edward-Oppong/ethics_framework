import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Book, Shield, Heart, Eye, FileText, Compass, AlertCircle, X, Check, Brain,
  Bookmark, Award, Clock, ArrowRight
} from 'lucide-react';

const FRAMEWORKS = [
  {
    id: 'utilitarianism',
    name: 'Utilitarianism',
    icon: <Scale size={16} />,
    difficulty: 'Intermediate',
    popularity: '95%',
    founder: 'Jeremy Bentham & John Stuart Mill',
    summary: 'Judges actions by outcomes. Aims to produce the greatest balance of benefit over harm for the most people.',
    applications: ['Resource Allocation', 'Public Health'],
    proponents: ['Jeremy Bentham', 'John Stuart Mill', 'Peter Singer'],
    history: 'Developed in late 18th-century England as a radical reformist theory to align legislation with human happiness rather than divine right.',
    corePrinciples: [
      'The Greatest Happiness Principle: Actions are right as they tend to promote happiness.',
      'Consequentialism: Only the outcomes of actions define their moral worth.',
      'Impartiality: Everyone\'s happiness counts equally.'
    ],
    advantages: [
      'Provides a pragmatic, quantifiable decision method.',
      'Focuses directly on human welfare and suffering reduction.',
      'Highly flexible in complex multi-stakeholder scenarios.'
    ],
    criticisms: [
      'Can justify exploiting minority rights for majority gain.',
      'Predicting future consequences is inherently uncertain.',
      'Hard to quantify non-material values like dignity or honor.'
    ],
    timeline: [
      { year: '1789', event: 'Bentham publishes Principles of Morals and Legislation.' },
      { year: '1861', event: 'Mill refines rule-utilitarianism in Utilitarianism.' },
      { year: '1975', event: 'Peter Singer applies preference utilitarianism to bioethics.' }
    ]
  },
  {
    id: 'deontology',
    name: 'Deontology',
    icon: <FileText size={16} />,
    difficulty: 'Advanced',
    popularity: '90%',
    founder: 'Immanuel Kant',
    summary: 'Judges actions by adherence to universal moral rules, duties, and rights, regardless of outcomes.',
    applications: ['Human Rights', 'Professional Codes'],
    proponents: ['Immanuel Kant', 'W.D. Ross', 'Christine Korsgaard'],
    history: 'Formulated during the Enlightenment to establish secular, rational moral obligations rooted in human autonomy.',
    corePrinciples: [
      'Categorical Imperative: Act only according to maxims you can will as universal laws.',
      'Formula of Humanity: Treat persons always as ends, never merely as means.',
      'Duty over Inclination: Moral worth exists only when acting from duty.'
    ],
    advantages: [
      'Protects fundamental human rights against expediency.',
      'Provides clear, unwavering moral boundaries.',
      'Respects human autonomy and dignity universally.'
    ],
    criticisms: [
      'Inflexible when moral duties conflict (e.g. lying to save a life).',
      'Ignores disastrous outcomes caused by rigid rule adherence.',
      'Abstract maxims can be hard to apply to novel tech dilemmas.'
    ],
    timeline: [
      { year: '1785', event: 'Kant publishes Groundwork of the Metaphysics of Morals.' },
      { year: '1930', event: 'W.D. Ross introduces Prima Facie duties.' },
      { year: '1948', event: 'Universal Declaration of Human Rights codifies deontological principles.' }
    ]
  },
  {
    id: 'virtue-ethics',
    name: 'Virtue Ethics',
    icon: <Compass size={16} />,
    difficulty: 'Intermediate',
    popularity: '85%',
    founder: 'Aristotle',
    summary: 'Focuses on the character, habits, and practical wisdom of the decision-maker rather than rules or outcomes.',
    applications: ['Leadership Mentoring', 'Professional Development'],
    proponents: ['Aristotle', 'Alasdair MacIntyre', 'Rosalind Hursthouse'],
    history: 'Rooted in ancient Greek philosophy (eudaimonia) and revived in the 20th century as an alternative to rules-based ethics.',
    corePrinciples: [
      'Eudaimonia: Human flourishing as the ultimate goal of moral life.',
      'The Golden Mean: Virtues exist as a balance between excess and deficiency.',
      'Phronesis: Practical wisdom developed through experience and reflection.'
    ],
    advantages: [
      'Emphasizes moral character and personal development.',
      'Sensitive to nuance, context, and relationships.',
      'Avoids overly rigid rules or mechanical calculations.'
    ],
    criticisms: [
      'Does not offer specific decision procedures for novel crises.',
      'Virtues can vary across cultures and eras.',
      'Can result in self-centered moral deliberation.'
    ],
    timeline: [
      { year: 'c. 350 BCE', event: 'Aristotle writes Nicomachean Ethics.' },
      { year: '1958', event: 'Elizabeth Anscombe initiates modern virtue ethics revival.' },
      { year: '1981', event: 'Alasdair MacIntyre publishes After Virtue.' }
    ]
  },
  {
    id: 'care-ethics',
    name: 'Care Ethics',
    icon: <Heart size={16} />,
    difficulty: 'Beginner',
    popularity: '80%',
    founder: 'Carol Gilligan & Nel Noddings',
    summary: 'Emphasizes responsiveness, vulnerability, relationships, and the contextual responsibilities we have to others.',
    applications: ['Bioethics & Healthcare', 'Family Law'],
    proponents: ['Carol Gilligan', 'Nel Noddings', 'Virginia Held'],
    history: 'Emerged in the 1980s from feminist critiques of traditional justice-focused moral theories.',
    corePrinciples: [
      'Relationality: Individuals are interdependent, not isolated autonomous units.',
      'Contextual Care: Moral action responds to specific concrete needs.',
      'Attunement: Emotional empathy and listening are central to moral judgment.'
    ],
    advantages: [
      'Grounds ethics in real human relationships and caretaking.',
      'Valuable in healthcare, education, and community governance.',
      'Highlights power imbalances and vulnerable populations.'
    ],
    criticisms: [
      'Can lead to parochial bias toward close relations over strangers.',
      'Lacks formal mechanisms for large-scale institutional justice.',
      'Risk of reinforcing traditional caregiving burdens.'
    ],
    timeline: [
      { year: '1982', event: 'Carol Gilligan publishes In a Different Voice.' },
      { year: '1984', event: 'Nel Noddings publishes Caring: A Feminine Approach to Ethics.' },
      { year: '2006', event: 'Virginia Held formalizes The Ethics of Care.' }
    ]
  },
  {
    id: 'rights-based',
    name: 'Rights-Based Ethics',
    icon: <Shield size={16} />,
    difficulty: 'Beginner',
    popularity: '92%',
    founder: 'John Locke',
    summary: 'Evaluates choices by whether they respect or violate fundamental individual rights, independent of aggregate utility.',
    applications: ['Constitutional Law', 'Data Privacy'],
    proponents: ['John Locke', 'Thomas Paine', 'Robert Nozick'],
    history: 'Evolved through Enlightenment natural rights theories and modern human rights charters.',
    corePrinciples: [
      'Inalienability: Rights belong inherently to persons and cannot be surrendered.',
      'Correlative Duties: Rights entail duties on others to respect or fulfill them.',
      'Negative & Positive Rights: Freedoms from interference vs entitlements to support.'
    ],
    advantages: [
      'Establishes strong protection against state or corporate overreach.',
      'Widely accepted in legal and international governance.',
      'Clear baseline for individual autonomy.'
    ],
    criticisms: [
      'Rights inflation can lead to conflicting claims without resolution mechanisms.',
      'Can encourage adversarial individualism over civic unity.',
      'Neglects positive obligations of community care.'
    ],
    timeline: [
      { year: '1689', event: 'Locke publishes Two Treatises of Government.' },
      { year: '1791', event: 'US Bill of Rights ratified.' },
      { year: '2018', event: 'EU General Data Protection Regulation (GDPR) enforces digital rights.' }
    ]
  },
  {
    id: 'justice-fairness',
    name: 'Justice & Fairness',
    icon: <Book size={16} />,
    difficulty: 'Advanced',
    popularity: '88%',
    founder: 'John Rawls',
    summary: 'Focuses on equitable distribution of benefits, burdens, decision-making power, and procedural fairness.',
    applications: ['Tax Policy', 'Criminal Justice'],
    proponents: ['John Rawls', 'Amartya Sen', 'Michael Sandel'],
    history: 'Rooted in social contract traditions and social justice philosophy of the 20th century.',
    corePrinciples: [
      'Veil of Ignorance: Design societal rules without knowing your social status.',
      'Difference Principle: Inequalities are justified only if they benefit the least advantaged.',
      'Procedural Fairness: Consistent, impartial processes for all participants.'
    ],
    advantages: [
      'Provides a rigorous framework for institutional and policy design.',
      'Prioritizes marginalized and vulnerable members of society.',
      'Combines liberty with structural equality.'
    ],
    criticisms: [
      'Veil of ignorance thought experiment is highly abstract.',
      'Can conflict with individual merit or property claims.',
      'Challenging to implement globally across diverse cultures.'
    ],
    timeline: [
      { year: '1971', event: 'John Rawls publishes A Theory of Justice.' },
      { year: '1999', event: 'Amartya Sen develops the Capability Approach.' },
      { year: '2009', event: 'Michael Sandel publishes Justice: What\'s the Right Thing to Do?' }
    ]
  }
];

export default function FrameworksView({ onSummon }) {
  const [selectedFw, setSelectedFw] = useState(null);

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          
          {/* Header */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Framework Library
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Explore core ethical theories and governance models. Click any card to inspect principles, pros/cons, and historical context.
            </p>
          </div>

          {/* Cards Grid with Generous Padding and Spacing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {FRAMEWORKS.map((fw, idx) => (
              <motion.div
                key={fw.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => setSelectedFw(fw)}
                style={{
                  padding: '24px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 18,
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
                  {/* Icon & Difficulty Badge Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)'
                    }}>
                      {fw.icon}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      color: 'var(--text-muted)'
                    }}>
                      {fw.difficulty}
                    </span>
                  </div>

                  {/* Title & Description with breathing room */}
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {fw.name}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {fw.summary}
                  </p>
                </div>

                {/* Application Pills & CTA Footer */}
                <div style={{
                  paddingTop: 14,
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {fw.applications.map((app, i) => (
                      <span key={i} style={{
                        fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 4,
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        color: 'var(--text-secondary)'
                      }}>
                        {app}
                      </span>
                    ))}
                  </div>

                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Inspect <ArrowRight size={13} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Expanded Modal Detail Drawer */}
      <AnimatePresence>
        {selectedFw && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFw(null)}
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
              {/* Modal Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ padding: 6, borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    {selectedFw.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedFw.name}</h3>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Origin: {selectedFw.founder}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFw(null)}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Summary</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedFw.summary}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Core Principles</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedFw.corePrinciples.map((p, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Key Strengths</h4>
                    <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selectedFw.advantages.map((a, i) => (
                        <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Common Criticisms</h4>
                    <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selectedFw.criticisms.map((c, i) => (
                        <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setSelectedFw(null)}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onSummon(selectedFw.name, selectedFw.id);
                    setSelectedFw(null);
                  }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'var(--bg-card)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Analyze with HuggingFace Model
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
