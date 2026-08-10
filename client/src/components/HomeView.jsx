import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, BookOpen, Brain, Grid, BarChart2, Shield,
  Scale, ChevronRight, Sparkles, Users, FlaskConical, Zap, Globe,
  ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: <MessageSquare size={22} className="text-primary" />,
    title: 'AI Ethics Chat',
    desc: 'Stream live ethical analysis across seven philosophical frameworks simultaneously. ChatGPT-rivaling UX.',
    route: 'chat',
    accent: 'blue',
  },
  {
    icon: <BookOpen size={22} className="text-secondary" />,
    title: 'Framework Library',
    desc: 'Deep-dive reference cards on Utilitarianism, Deontology, Care Ethics, and more — with interactive detail modals.',
    route: 'frameworks',
    accent: 'purple',
  },
  {
    icon: <Brain size={22} className="text-accent" />,
    title: 'Decision Analyzer',
    desc: 'Five-step interactive wizard that maps stakeholders, calculates framework alignment, and outputs an ethics score.',
    route: 'analyzer',
    accent: 'teal',
  },
  {
    icon: <Grid size={22} className="text-warning" />,
    title: 'Case Studies',
    desc: 'Six landmark ethical failures — Therac-25, Cambridge Analytica, COMPAS — with lessons extracted per framework.',
    route: 'cases',
    accent: 'amber',
  },
  {
    icon: <BarChart2 size={22} className="text-success" />,
    title: 'Dashboard',
    desc: 'Visual analytics on your analysis history, framework usage frequency, and risk distribution charts.',
    route: 'dashboard',
    accent: 'green',
  },
  {
    icon: <Shield size={22} className="text-danger" />,
    title: 'Anti-Manipulation Guard',
    desc: 'Built-in guardrails that strip corporate euphemisms and counterweight weaponized single-framework arguments.',
    route: 'chat',
    accent: 'red',
  },
];

const STATS = [
  { label: 'Ethical Frameworks', value: '7' },
  { label: 'Diagnostic Lenses', value: '3' },
  { label: 'AI Providers', value: '3' },
  { label: 'Case Studies', value: '6+' },
];

// Particle canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Floating glow shape
function GlowOrb({ className, color }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${color} ${className}`}
    />
  );
}

export default function HomeView({ onNavigate, onStartChat }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        {/* Particle background */}
        <ParticleCanvas />

        {/* Glow orbs */}
        <GlowOrb className="w-[500px] h-[500px] -top-32 -left-24" color="bg-primary/20" />
        <GlowOrb className="w-[400px] h-[400px] -bottom-16 -right-16" color="bg-secondary/20" />
        <GlowOrb className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="bg-accent/10" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
          >
            <Sparkles size={12} />
            AI-Powered Ethical Reasoning Platform
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse ml-1" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-[var(--text-primary)]"
          >
            Making Ethical{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Decisions
              </span>
            </span>
            {' '}with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Ethics Critic analyzes dilemmas, decisions, and claims through seven ethical
            frameworks and three diagnostic lenses — surfacing tradeoffs, not verdicts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('chat')}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-xl shadow-primary/30 hover:bg-blue-600 transition-colors"
            >
              <MessageSquare size={16} />
              Start Chatting
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('frameworks')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/50 backdrop-blur-sm text-[var(--text-primary)] font-semibold text-sm hover:border-primary/40 hover:bg-[var(--bg-card)] transition-all"
            >
              <BookOpen size={16} />
              Explore Frameworks
            </motion.button>
          </motion.div>

          {/* Stat Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section className="px-6 py-20 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight"
          >
            Everything you need for ethical clarity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto"
          >
            Six integrated modules that move from raw dilemma to structured insight.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              onClick={() => onNavigate(f.route)}
              className="group cursor-pointer bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
            >
              {/* hover gradient glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-${f.accent}-500/5 to-transparent`} />

              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-[var(--bg-surface)] rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 py-20 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-12 text-center"
        >
          {/* ambient orb */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Scale size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Ready to think deeper?
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-lg mx-auto">
              Submit your first ethical dilemma and receive a structured multi-framework critique in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStartChat('Is it ethical to use AI-generated content without disclosing it to readers?')}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-xl shadow-primary/30 hover:bg-blue-600 transition-colors"
              >
                <Zap size={16} />
                Try an Example
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('analyzer')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm text-[var(--text-primary)] font-semibold text-sm hover:border-primary/50 transition-all"
              >
                <Brain size={16} />
                Open Analyzer
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
