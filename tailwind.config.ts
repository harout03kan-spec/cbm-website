
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0A0A',
        graphite: '#141414',
        'crimson-accent': '#DC2626',
        'soft-gray': '#A3A3A3',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
        'gradient-crimson': 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fan-spin': 'fan-spin 1.1s linear infinite',
        'led-flicker': 'led-flicker 2.4s ease-in-out infinite',
        'current-flow': 'current-flow 1.2s linear infinite',
        'energy-rise': 'energy-rise 3.2s ease-in-out infinite',
        'orbit': 'orbit 14s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)' },
        },
        'fan-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'led-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'current-flow': {
          to: { strokeDashoffset: '-24' },
        },
        'energy-rise': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '20%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-26px)', opacity: '0' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
