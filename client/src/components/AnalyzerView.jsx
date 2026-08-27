import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, CheckCircle2, ChevronRight,
  Users, AlertTriangle, BarChart2, Layers
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const STEPS = [
  { id: 1, label: 'Define Dilemma',   icon: <Brain size={16} /> },
  { id: 2, label: 'Identify Stakes',  icon: <Users size={16} /> },
  { id: 3, label: 'Framework Scan',   icon: <Layers size={16} /> },
  { id: 4, label: 'Risk Assessment',  icon: <AlertTriangle size={16} /> },
  { id: 5, label: 'Final Analysis',   icon: <BarChart2 size={16} /> },
];

const FRAMEWORKS_SCAN = [
  { name: 'Utilitarian', key: 'utilitarian' },
  { name: 'Deontological', key: 'deontological' },
  { name: 'Virtue Ethics', key: 'virtue' },
  { name: 'Care Ethics', key: 'care' },
  { name: 'Rights-Based', key: 'rights' },
  { name: 'Justice', key: 'justice' },
];

const STAKEHOLDER_ROLES = ['Primary Decision Maker','Directly Affected Party','Regulatory Body','Public / Society','Future Generations'];
const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export default function AnalyzerView({ onSendToChat }) {
  const [step, setStep] = useState(1);
  const [dilemma, setDilemma] = useState('');
  const [intent, setIntent] = useState('');
  const [stakeholders, setStakeholders] = useState([{ role: 'Primary Decision Maker', concern: '' }]);
  const [fwScores, setFwScores] = useState({
    utilitarian: 5, deontological: 5, virtue: 5, care: 5, rights: 5, justice: 5,
  });
  const [risks, setRisks] = useState([{ name: '', level: 'Medium' }]);
  const [reversibility, setReversibility] = useState('two-way');
  const [ethicsScore, setEthicsScore] = useState(null);

  const radarData = FRAMEWORKS_SCAN.map(fw => ({
    subject: fw.name,
    score: fwScores[fw.key],
  }));

  const calcScore = () => {
    const avg = Object.values(fwScores).reduce((a, b) => a + b, 0) / 6;
    const highRisks = risks.filter(r => r.level === 'Critical' || r.level === 'High').length;
    const penalty = highRisks * 8;
    const reversBonus = reversibility === 'two-way' ? 5 : 0;
    return Math.min(100, Math.max(0, Math.round(avg * 10 - penalty + reversBonus)));
  };

  const addStakeholder = () => setStakeholders(prev => [...prev, { role: STAKEHOLDER_ROLES[0], concern: '' }]);
  const addRisk = () => setRisks(prev => [...prev, { name: '', level: 'Medium' }]);

  const goNext = () => {
    if (step === 4) setEthicsScore(calcScore());
    setStep(s => Math.min(5, s + 1));
  };
  const goBack = () => setStep(s => Math.max(1, s - 1));

  const handleSend = () => {
    const prompt = `Please run a full ethical analysis on this dilemma:\n\n"${dilemma}"\n\nContext & intent: ${intent}\n\nKey stakeholders: ${stakeholders.map(s => `${s.role} (${s.concern})`).join(', ')}\n\nIdentified risks: ${risks.map(r => `${r.name} (${r.level})`).join(', ')}\n\nReversibility: ${reversibility === 'one-way' ? 'One-Way Door (Irreversible)' : 'Two-Way Door (Reversible)'}`;
    onSendToChat(prompt);
  };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Decision Analyzer
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Walk through a 5-step structured ethical evaluation. Map stakeholders, scan frameworks, and produce a risk-weighted score.
            </p>
          </div>

          {/* Step Indicator Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '12px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => step > s.id && setStep(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                  borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none',
                  background: step === s.id ? 'var(--bg-surface)' : 'transparent',
                  color: step === s.id ? 'var(--text-primary)' : step > s.id ? 'var(--text-secondary)' : 'var(--text-muted)',
                  cursor: step > s.id ? 'pointer' : 'default',
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  background: step === s.id ? 'var(--accent)' : 'var(--bg-surface)',
                  color: step === s.id ? 'var(--bg-card)' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}>
                  {s.id}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Main Card Container */}
          <div style={{ padding: '28px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}
              >
                {/* Step 1 */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Brain size={18} />
                      <span>Define Your Dilemma</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        Describe the situation or decision
                      </label>
                      <textarea
                        value={dilemma}
                        onChange={e => setDilemma(e.target.value)}
                        placeholder="e.g., Should my company deploy facial recognition in public spaces to improve security, even without explicit user consent?"
                        rows={5}
                        className="input-base"
                        style={{ width: '100%', resize: 'vertical', minHeight: 120 }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        What is the intended goal or outcome?
                      </label>
                      <input
                        value={intent}
                        onChange={e => setIntent(e.target.value)}
                        placeholder="e.g., Reduce crime rates and improve public safety metrics"
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Users size={18} />
                      <span>Stakeholder Map</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Identify key parties affected by this decision and their primary concerns.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                      {stakeholders.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
                          <select
                            value={s.role}
                            onChange={e => {
                              const updated = [...stakeholders];
                              updated[i].role = e.target.value;
                              setStakeholders(updated);
                            }}
                            className="input-base"
                            style={{ width: 220, flexShrink: 0 }}
                          >
                            {STAKEHOLDER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <input
                            value={s.concern}
                            onChange={e => {
                              const updated = [...stakeholders];
                              updated[i].concern = e.target.value;
                              setStakeholders(updated);
                            }}
                            placeholder="Primary concern..."
                            className="input-base"
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addStakeholder}
                      style={{ fontSize: 12, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, width: 'fit-content' }}
                    >
                      + Add Stakeholder
                    </button>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Layers size={18} />
                      <span>Framework Alignment Scan</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Rate how well your action aligns with each ethical framework (1 = Conflict, 10 = Strong Alignment).</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
                      {FRAMEWORKS_SCAN.map(fw => (
                        <div key={fw.key} style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                          <span style={{ width: 140, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flexShrink: 0 }}>{fw.name}</span>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={fwScores[fw.key]}
                            onChange={e => setFwScores(prev => ({ ...prev, [fw.key]: Number(e.target.value) }))}
                            style={{ flex: 1, accentColor: 'var(--text-primary)' }}
                          />
                          <span style={{ width: 32, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{fwScores[fw.key]}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ height: 200, width: '100%', marginTop: 12 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="var(--border)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                          <PolarRadiusAxis domain={[0, 10]} tick={false} />
                          <Radar name="Alignment" dataKey="score" stroke="var(--text-primary)" fill="var(--bg-surface)" fillOpacity={0.6} strokeWidth={1.5} />
                          <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={18} />
                      <span>Risk Assessment</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Identify Potential Risks</label>
                      {risks.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, width: '100%' }}>
                          <input
                            value={r.name}
                            onChange={e => {
                              const updated = [...risks];
                              updated[i].name = e.target.value;
                              setRisks(updated);
                            }}
                            placeholder="Risk description..."
                            className="input-base"
                            style={{ flex: 1 }}
                          />
                          <select
                            value={r.level}
                            onChange={e => {
                              const updated = [...risks];
                              updated[i].level = e.target.value;
                              setRisks(updated);
                            }}
                            className="input-base"
                            style={{ width: 140, flexShrink: 0 }}
                          >
                            {RISK_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addRisk}
                      style={{ fontSize: 12, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, width: 'fit-content' }}
                    >
                      + Add Risk Factor
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Decision Reversibility</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {[
                          { id: 'two-way', label: 'Reversible (Two-Way Door)' },
                          { id: 'one-way', label: 'Irreversible (One-Way Door)' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setReversibility(opt.id)}
                            style={{
                              flex: 1, padding: '10px 14px', borderRadius: 6,
                              border: reversibility === opt.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                              background: reversibility === opt.id ? 'var(--bg-surface)' : 'var(--bg-card)',
                              color: reversibility === opt.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontSize: 12, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Analysis Complete</div>
                      <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{ethicsScore}<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/100</span></div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 8 }}>
                        Ethical Confidence Score
                      </div>
                    </div>

                    <div style={{ padding: '16px 20px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Dilemma Summary</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{dilemma || 'No dilemma defined.'}</p>
                    </div>

                    <button
                      onClick={handleSend}
                      style={{
                        padding: '12px 24px', borderRadius: 6,
                        background: 'var(--accent)', color: 'var(--bg-card)',
                        fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer'
                      }}
                    >
                      Send Full Analysis to AI Ethics Assistant
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={goBack}
                disabled={step === 1}
                style={{
                  padding: '8px 16px', borderRadius: 6,
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  opacity: step === 1 ? 0.4 : 1
                }}
              >
                ← Back
              </button>
              {step < 5 && (
                <button
                  onClick={goNext}
                  disabled={step === 1 && !dilemma.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 6,
                    border: 'none', background: 'var(--accent)',
                    color: 'var(--bg-card)', fontSize: 12, fontWeight: 600,
                    cursor: (step === 1 && !dilemma.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (step === 1 && !dilemma.trim()) ? 0.4 : 1
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
