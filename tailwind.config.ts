import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#06080F',
        surface: {
          50: '#0F1524',
          100: '#141D32',
          200: '#1C2744',
          300: '#25345B',
        },
        cyber: {
          cyan: '#00F0FF',
          blue: '#2B7FFF',
          purple: '#8B5CF6',
          violet: '#A855F7',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        dbuu: {
          orange: '#FF5722',
          navy: '#002B49',
          gold: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': "radial-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -5px rgba(0, 240, 255, 0.4), 0 0 40px -10px rgba(0, 240, 255, 0.2)',
        'neon-purple': '0 0 20px -5px rgba(168, 85, 247, 0.4), 0 0 40px -10px rgba(168, 85, 247, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};

export default config;
