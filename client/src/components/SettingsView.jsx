import { useState } from 'react';
import { Settings, Shield, User, Volume2, Database, Trash2, Check, FileText, Download, Scale, Info } from 'lucide-react';
import ProviderSelector from './ProviderSelector.jsx';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, padding: 3,
        background: checked ? 'var(--accent)' : 'var(--bg-surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
        display: 'flex', alignItems: 'center'
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 8,
        background: checked ? 'var(--accent-text)' : 'var(--text-muted)',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 0.2s'
      }} />
    </button>
  );
}

function Card({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--bg-surface)',
          color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          transition: 'border-color 0.15s'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 640, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {children}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--accent)', color: 'var(--bg-card)', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsView({ provider, providerStatus, onProviderChange, darkMode, onToggleDark }) {
  const [profile, setProfile] = useState({
    name: 'Ethics Scholar',
    email: 'scholar@ethics.ai',
    role: 'Principal Ethicist',
    org: 'Global AI Alliance'
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const data = {
      profile,
      sessions: JSON.parse(localStorage.getItem('ec_sessions_v4') || '[]'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethics-critic-export-${Date.now()}.json`;
    a.click();
  };

  const handleReset = () => {
    if (confirm('Clear all history and local state? This is irreversible.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>

          {/* Page Header */}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Settings & Regulatory Compliance</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Manage your scholar profile, model parameters, transparency declarations, and privacy rights.
            </p>
          </div>

          {/* Profile */}
          <Card title="Scholar Profile" icon={<User size={18} />}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
              <Field label="Display Name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} />
              <Field label="Email Address" value={profile.email} onChange={v => setProfile({ ...profile, email: v })} />
              <Field label="Role" value={profile.role} onChange={v => setProfile({ ...profile, role: v })} />
              <Field label="Organization" value={profile.org} onChange={v => setProfile({ ...profile, org: v })} />
            </div>
          </Card>

          {/* AI Provider */}
          <Card title="AI Provider Configuration" icon={<Shield size={18} />}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Select which language model provider powers ethical analyses. Configure API keys in your server <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-surface)', padding: '1px 5px', borderRadius: 4 }}>.env</code> file.
            </p>
            <div style={{ maxWidth: 360 }}>
              <ProviderSelector active={provider} status={providerStatus} onChange={onProviderChange} />
            </div>
          </Card>

          {/* Regulatory & Model Attribution */}
          <Card title="Model Transparency & Regulatory Licensing" icon={<Info size={18} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Meta Llama 3 Community License Attribution:</strong><br />
                Ethics Critic leverages Meta Llama 3.3 (70B Instruct) via Groq Cloud Inference under the Meta Llama 3 Community License. Copyright © Meta Platforms, Inc. All Rights Reserved.
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>EU Artificial Intelligence Act (Article 50 Compliance):</strong><br />
                All outputs produced by this system are machine-generated text by Large Language Models. Responses are non-binding decision-support analyses designed for analytical deliberation.
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setActiveModal('privacy')} style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Read Privacy Policy (GDPR / CCPA)
                </button>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <button onClick={() => setActiveModal('terms')} style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Read Terms of Service & Liability Shield
                </button>
              </div>
            </div>
          </Card>

          {/* Interface & Accessibility */}
          <Card title="Interface & Accessibility" icon={<Volume2 size={18} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Dark Mode', desc: 'Use the warm dark interface.', checked: darkMode, onChange: onToggleDark },
                { label: 'Reduced Motion', desc: 'Minimize transitions and animations.', checked: reducedMotion, onChange: () => setReducedMotion(v => !v) },
                { label: 'High Contrast', desc: 'Increase text contrast for accessibility.', checked: highContrast, onChange: () => setHighContrast(v => !v) },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <Toggle checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </Card>

          {/* Data Management */}
          <Card title="Data Rights & Erasure (GDPR Art. 17)" icon={<Database size={18} />}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              You retain total control over your inquiry data. Export your full history as JSON or purge your local session state.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleExport}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <Download size={13} /> Export All Data (JSON)
              </button>
              <button
                onClick={handleReset}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: '1px solid #fca5a5', background: 'transparent', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={13} /> Purge All History & Reset
              </button>
            </div>
          </Card>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
            {saved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#10b981' }}>
                <Check size={14} /> Settings saved
              </span>
            )}
            <button
              onClick={handleSave}
              style={{
                padding: '10px 24px', borderRadius: 10,
                background: 'var(--accent)', color: 'var(--bg-card)',
                fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'privacy' && (
        <Modal title="Privacy Policy & GDPR Disclosure" onClose={() => setActiveModal(null)}>
          <p style={{ marginBottom: 12 }}><strong>Effective Date:</strong> August 2026</p>
          <p style={{ marginBottom: 12 }}><strong>Data Collection & Minimization:</strong> Ethics Critic processes email address, name, role, and text prompts submitted during inquiry sessions. Prompts are transmitted via secure HTTPS to server endpoints and proxied to Groq / LLM inference APIs strictly for generating responses.</p>
          <p style={{ marginBottom: 12 }}><strong>Data Retention:</strong> Inquiry sessions are stored locally in your browser state (`localStorage`). You can purge or export your data at any time via Settings.</p>
          <p style={{ marginBottom: 12 }}><strong>Third-Party Vendors:</strong> AI inference is processed by Groq Cloud. No prompt data is used for third-party advertising or commercial tracking.</p>
        </Modal>
      )}

      {activeModal === 'terms' && (
        <Modal title="Terms of Service & Liability Disclaimer" onClose={() => setActiveModal(null)}>
          <p style={{ marginBottom: 12 }}><strong>1. Educational & Analytical Purpose:</strong> Ethics Critic provides multi-framework Artificial Intelligence critique. It does NOT provide legal, medical, financial, or formal compliance advice.</p>
          <p style={{ marginBottom: 12 }}><strong>2. Non-Binding Analysis:</strong> Outputs generated by AI models reflect theoretical ethical perspectives (Utilitarianism, Deontology, etc.). Users assume sole responsibility for decisions made in real-world scenarios.</p>
          <p style={{ marginBottom: 12 }}><strong>3. Limitation of Liability:</strong> Under no circumstances shall Ethics Critic, its developers, or model providers be liable for indirect, incidental, or consequential damages resulting from reliance on AI-generated analyses.</p>
        </Modal>
      )}

    </div>
  );
}
