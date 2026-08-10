import { motion } from 'framer-motion';
import {
  BarChart2, BarChart, PieChart, TrendingUp, MessageSquare,
  Scale, BookOpen, Brain, Activity
} from 'lucide-react';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie, Legend,
  LineChart, Line, CartesianGrid,
  AreaChart, Area,
} from 'recharts';

const FW_DATA = [
  { name: 'Utilitarian',  uses: 42, fill: '#2563EB' },
  { name: 'Deontology',   uses: 35, fill: '#7C3AED' },
  { name: 'Virtue',       uses: 28, fill: '#14B8A6' },
  { name: 'Care Ethics',  uses: 21, fill: '#EF4444' },
  { name: 'Rights-Based', uses: 18, fill: '#F59E0B' },
  { name: 'Justice',      uses: 31, fill: '#06B6D4' },
];

const RISK_PIE = [
  { name: 'Low',      value: 30, fill: '#22C55E' },
  { name: 'Medium',   value: 45, fill: '#F59E0B' },
  { name: 'High',     value: 18, fill: '#EF4444' },
  { name: 'Critical', value: 7,  fill: '#7C3AED' },
];

const WEEKLY = [
  { day: 'Mon', chats: 2, analyses: 3 },
  { day: 'Tue', chats: 5, analyses: 7 },
  { day: 'Wed', chats: 3, analyses: 5 },
  { day: 'Thu', chats: 8, analyses: 12 },
  { day: 'Fri', chats: 6, analyses: 9 },
  { day: 'Sat', chats: 2, analyses: 4 },
  { day: 'Sun', chats: 4, analyses: 6 },
];

const TOPICS = [
  { topic: 'AI Hiring', count: 14 },
  { topic: 'Data Privacy', count: 11 },
  { topic: 'Climate Action', count: 9 },
  { topic: 'Medical Ethics', count: 8 },
  { topic: 'Autonomous Vehicles', count: 6 },
  { topic: 'Surveillance', count: 5 },
];

const CHART_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    fontSize: 11,
    color: 'var(--text-primary)',
  }
};

const INSIGHT_CARDS = [
  { label: 'Total Analyses',   value: '47',  icon: <Scale size={18} className="text-primary" />,    change: '+12 this week', up: true },
  { label: 'Chat Sessions',    value: '30',  icon: <MessageSquare size={18} className="text-secondary" />, change: '+5 this week', up: true },
  { label: 'Avg Ethics Score', value: '82',  icon: <TrendingUp size={18} className="text-success" />,   change: '+4 pts', up: true },
  { label: 'Frameworks Used',  value: '7/7', icon: <BookOpen size={18} className="text-accent" />,      change: 'Full coverage', up: true },
];

export default function AnalyticsView() {
  return (
    <div className="page-view">
      <div className="page-scroll">
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Analytics</h2>
          <p className="mt-2 text-[var(--text-secondary)]">Comprehensive insights into your ethical reasoning activity, framework usage, and risk distribution.</p>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {INSIGHT_CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[var(--bg-surface)] rounded-xl">{c.icon}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">{c.change}</span>
              </div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{c.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{c.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly activity */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} className="text-primary" />
            <span className="text-sm font-bold text-[var(--text-primary)]">Weekly Activity — Chats & Analyses</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY}>
                <defs>
                  <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analysisGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_STYLE} />
                <Area type="monotone" dataKey="chats"    stroke="#7C3AED" strokeWidth={2} fill="url(#chatGrad)"     name="Chats" />
                <Area type="monotone" dataKey="analyses" stroke="#2563EB" strokeWidth={2} fill="url(#analysisGrad)" name="Analyses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Framework bar */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Framework Usage Frequency</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={FW_DATA} barSize={30}>
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_STYLE} />
                  <Bar dataKey="uses" radius={[6,6,0,0]} name="Sessions">
                    {FW_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Pie */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Risk Distribution</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={RISK_PIE} cx="50%" cy="45%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {RISK_PIE.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip {...CHART_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top topics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Most Common Topics</div>
          <div className="space-y-3">
            {TOPICS.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[var(--text-secondary)] w-32">{t.topic}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.count / 14) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)] w-6 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
