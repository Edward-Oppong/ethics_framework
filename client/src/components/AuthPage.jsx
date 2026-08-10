import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const INPUT_STYLE = {
  width: '100%', boxSizing: 'border-box',
  padding: '11px 14px', borderRadius: 8,
  border: '1px solid #e4e4e7',
  background: '#fafafa', color: '#09090b',
  fontSize: 14, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
};

function InputField({ label, type, value, onChange, placeholder, id }) {
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPw = type === 'password';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: '#3f3f46' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={isPw && showPw ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            ...INPUT_STYLE,
            borderColor: focused ? '#09090b' : '#e4e4e7',
            boxShadow: focused ? '0 0 0 3px rgba(9,9,11,0.06)' : 'none',
            paddingRight: isPw ? 44 : 14,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 2 }}
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState('login');  // 'login' | 'register'
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Scholar');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const ROLES = ['Scholar', 'Ethicist', 'Policy Analyst', 'Researcher', 'Educator', 'Student'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await register(name.trim(), email.trim(), password, role);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", overflow: 'hidden', zIndex: 9999, background: '#fff' }}>

      {/* Left — Form Panel */}
      <div style={{ width: 440, minWidth: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 48px', background: '#fff', overflowY: 'auto', borderRight: '1px solid #e4e4e7' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={17} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>Ethics Critic</div>
              <div style={{ fontSize: 10, color: '#71717a', marginTop: 1 }}>Multi-Framework AI Platform</div>
            </div>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em', marginBottom: 4 }}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p style={{ fontSize: 13, color: '#71717a', marginBottom: 32, lineHeight: 1.5 }}>
                {mode === 'login'
                  ? 'Sign in to continue your ethical inquiry sessions.'
                  : 'Join the platform to analyze decisions through multiple ethical lenses.'}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <InputField id="name" label="Full Name" type="text" value={name} onChange={setName} placeholder="Dr. Jane Smith" />
            )}

            <InputField id="email" label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@institution.edu" />
            <InputField id="password" label="Password" type="password" value={password} onChange={setPassword} placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'} />

            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#3f3f46' }}>Your Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ ...INPUT_STYLE, appearance: 'none', cursor: 'pointer' }}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 12, color: '#dc2626' }}>
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px', borderRadius: 9, border: 'none',
                background: loading ? '#d4d4d8' : '#09090b',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s', marginTop: 4,
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Mode toggle */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <span style={{ fontSize: 13, color: '#71717a' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ fontSize: 13, fontWeight: 700, color: '#09090b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </div>

          {/* Demo shortcut */}
          <button
            type="button"
            onClick={() => { setEmail('demo@ethics.ai'); setPassword('demo123'); setMode('login'); }}
            style={{
              width: '100%', marginTop: 18, padding: '10px 14px', borderRadius: 8,
              background: '#f4f4f5', border: '1px solid #e4e4e7', fontSize: 11,
              color: '#3f3f46', textAlign: 'center', cursor: 'pointer',
              transition: 'background 0.12s, border-color 0.12s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#e4e4e7'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#f4f4f5'; }}
          >
            ⚡ Click to quick-fill demo account (<strong>demo@ethics.ai</strong>)
          </button>

          {/* Privacy & Legal Disclaimer */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 10, color: '#a1a1aa', lineHeight: 1.5 }}>
            By signing in, you agree to our{' '}
            <span style={{ textDecoration: 'underline', color: '#71717a', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ textDecoration: 'underline', color: '#71717a', cursor: 'pointer' }}>Privacy Policy</span>.
            <br />
            Outputs are generated by AI models for advisory deliberation only.
          </div>

        </div>
      </div>

      {/* Right — Image Panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          src="/auth-bg.jpg"
          alt="Ethics library"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Overlay with quote */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(9,9,11,0.55) 0%, rgba(9,9,11,0.2) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px',
        }}>
          <blockquote style={{ color: '#fff', maxWidth: 420 }}>
            <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 16 }}>
              "The unexamined decision is not worth making."
            </p>
            <footer style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
              — Ethics Critic Platform
            </footer>
          </blockquote>
          <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {['6 Ethical Frameworks', 'Groq AI Engine', 'Real-Time Analysis', 'Council Debate Mode'].map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
