import { motion } from 'framer-motion';
import { Shield, Eye, Users, Scale, Activity } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

const RISKS = [
  { key: 'privacy',        label: 'Privacy',        score: 42, icon: <Eye size={14} />,       desc: 'Data exposure risk — consent mechanisms are insufficient.' },
  { key: 'bias',           label: 'Algorithmic Bias',score: 65, icon: <Users size={14} />,     desc: 'Bias detected in demographic distribution of training data.' },
  { key: 'transparency',   label: 'Transparency',   score: 55, icon: <Eye size={14} />,       desc: 'Decision logic partially explainable but lacks audit trails.' },
  { key: 'safety',         label: 'Safety',          score: 88, icon: <Shield size={14} />,    desc: 'Strong safety measures in place with redundant systems.' },
  { key: 'fairness',       label: 'Fairness',        score: 71, icon: <Scale size={14} />,     desc: 'Distributional fairness metrics pass but edge cases remain.' },
  { key: 'accountability', label: 'Accountability',  score: 60, icon: <Activity size={14} />,  desc: 'Responsibility chains partially defined; escalation paths required.' },
  { key: 'autonomy',       label: 'Autonomy',        score: 48, icon: <Users size={14} />,     desc: 'User agency curtailed without explicit opt-out mechanisms.' },
];

const TREND_DATA = [
  { month: 'Feb', score: 58 },
  { month: 'Mar', score: 63 },
  { month: 'Apr', score: 60 },
  { month: 'May', score: 70 },
  { month: 'Jun', score: 74 },
  { month: 'Jul', score: 76 },
];

const CHART_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    fontSize: 11,
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
  }
};

const overallScore = Math.round(RISKS.reduce((a, r) => a + r.score, 0) / RISKS.length);
const radarData = RISKS.map(r => ({ subject: r.label.split(' ')[0], score: r.score }));

function RiskBar({ risk }) {
  const level = risk.score >= 75 ? 'Low Risk' : risk.score >= 50 ? 'Medium Risk' : 'High Risk';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--text-muted)' }}>{risk.icon}</span>
          <span>{risk.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {level}
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', width: 32, textAlign: 'right' }}>{risk.score}</span>
        </div>
      </div>
      <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--bg-surface)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${risk.score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: 'var(--text-primary)' }}
        />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{risk.desc}</p>
    </div>
  );
}

export default function EthicsRiskView() {
  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Ethics Risk Board
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Multi-dimensional ethical risk profiling across 7 core governance dimensions with trend tracking.
            </p>
          </div>

          {/* Overall Score Banner */}
          <div style={{
            padding: '24px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 36,
              border: '4px solid var(--border)', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{overallScore}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>
                Overall Ethics Status
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {overallScore >= 75 ? 'Good Standing' : overallScore >= 50 ? 'Attention Recommended' : 'Critical Issues'}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your ethical profile shows strengths in safety and fairness, but privacy and autonomy require active mitigation strategies.
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            <div style={{ padding: '20px 24px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', height: 240, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Risk Radar Profile</div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0,100]} tick={false} />
                    <Radar dataKey="score" stroke="var(--text-primary)" fill="var(--bg-surface)" fillOpacity={0.6} strokeWidth={1.5} />
                    <Tooltip {...CHART_STYLE} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ padding: '20px 24px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', height: 240, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Score Trend (6 Months)</div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50,100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip {...CHART_STYLE} />
                    <Area type="monotone" dataKey="score" stroke="var(--text-primary)" strokeWidth={1.5} fill="var(--bg-surface)" dot={{ fill: 'var(--text-primary)', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div style={{ padding: '24px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>
              Dimension Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {RISKS.map((r) => (
                <RiskBar key={r.key} risk={r} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
