/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   '#2563EB',
        secondary: '#7C3AED',
        accent:    '#14B8A6',
        success:   '#22C55E',
        warning:   '#F59E0B',
        danger:    '#EF4444',
        muted:     '#64748B',
      },
      borderRadius: {
        premium: '18px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary':   '0 0 30px rgba(37,99,235,0.25)',
        'glow-secondary': '0 0 30px rgba(124,58,237,0.25)',
        'glow-accent':    '0 0 30px rgba(20,184,166,0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
