// ============================================================
//  Ethics Critic — Executive Ethical Impact Assessment Certificate
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Download, ShieldCheck, Scale, AlertTriangle, CheckCircle2, Award } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function AuditReportModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const defaultData = {
    title: data?.title || 'Autonomous AI Decision System Deployment in Public Healthcare',
    score: data?.score || 78,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: data?.author || 'Executive Ethics Review Committee',
    reversibility: data?.reversibility || 'Two-Way Door (Score: 2/5 - Reversible Rollback Feasible)',
    radarData: data?.radarData || [
      { subject: 'Utilitarian', score: 8.5 },
      { subject: 'Deontology', score: 6.0 },
      { subject: 'Virtue', score: 7.5 },
      { subject: 'Care', score: 8.0 },
      { subject: 'Rights', score: 6.5 },
      { subject: 'Justice', score: 7.0 },
    ],
    stakeholders: data?.stakeholders || [
      { role: 'Vulnerable Patients', impact: 'Direct Care', risk: 'Medium' },
      { role: 'Clinical Staff', impact: 'Workflow Automation', risk: 'Low' },
      { role: 'Hospital Administration', impact: 'Resource Efficiency', risk: 'Low' },
    ],
    safeguards: data?.safeguards || [
      'Maintain mandatory human-in-the-loop override on all critical triage recommendations.',
      'Conduct monthly algorithmic disparate impact audits across demographic sub-populations.',
      'Establish an independent patient ombudsman office for automated decision appeals.',
      'Publish open transparency metrics on automated vs. human clinical concordance.'
    ]
  };

  const report = { ...defaultData, ...(data || {}) };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 720,
          background: 'var(--bg-card)', borderRadius: 14,
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)', zIndex: 10,
          display: 'flex', flexDirection: 'column', maxHeight: '90vh'
        }}
      >
        {/* Header Bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Executive AI Ethics Impact Certificate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)',
                fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer'
              }}
            >
              <Printer size={13} /> Print / Save PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable) */}
        <div id="ethics-certificate-area" style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Certificate Title Badge */}
          <div style={{
            border: '2px double var(--border-strong)', padding: '20px 24px', borderRadius: 10,
            background: 'var(--bg-surface)', textAlign: 'center', position: 'relative'
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)' }}>
              Official Evaluation Document · EU AI Act & NIST RMF 1.0 Aligned
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6, letterSpacing: '-0.02em' }}>
              {report.title}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>Date: {report.date}</span>
              <span>•</span>
              <span>Status: <strong style={{ color: '#10b981' }}>Conditionally Approved</strong></span>
            </div>
          </div>

          {/* Scores & Radar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center' }}>
            <div style={{
              padding: '20px', borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-card)', textAlign: 'center', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                {report.score}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 6 }}>
                Ethical Confidence Index
              </div>
            </div>

            <div style={{ height: 160, width: '100%', background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)', padding: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={report.radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} />
                  <Radar dataKey="score" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostic Lenses Check */}
          <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Diagnostic Reality Checks
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span><strong>Precedent:</strong> Mirroring landmark cases</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span><strong>Pre-Mortem:</strong> 5-Yr risk failure tested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span><strong>Reversibility:</strong> {report.reversibility}</span>
              </div>
            </div>
          </div>

          {/* Required Safeguards */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Mandatory Governance Safeguards & Conditions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {report.safeguards.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
