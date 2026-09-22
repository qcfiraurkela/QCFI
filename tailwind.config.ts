import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#EBEFF2',
        'text-dark': '#050A14',
        'text-primary': '#081738',
        accent: '#1D45ED',
        success: '#10B981',
        danger: '#EF4444',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'hero-aura': 'heroAuraSpin 40s linear infinite',
        'gear-rotate': 'gearRotate 18s linear infinite',
        'machine-breathe': 'machineBreathe 5s ease-in-out infinite alternate',
        'data-pulse': 'dataPulse 3.4s ease-in-out infinite alternate',
        'field-pulse': 'fieldPulse 5s ease-in-out infinite alternate',
        'quality-scan': 'qualityScan 4.8s cubic-bezier(0.4,0,0.2,1) infinite',
        'scroll-drop': 'scrollDropLight 1.5s infinite',
        'chain-move': 'chainMove 4s linear infinite',
        'spin-ring': 'spinRing 12s linear infinite',
        'dash-anim': 'dashAnim 4s linear infinite',
        'pulse-core': 'pulseCore 3s ease-in-out infinite',
        'scan-line': 'scanLine 6s cubic-bezier(0.4,0,0.2,1) infinite',
        'fade-in': 'panelFadeIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        spinner: 'spin 1s cubic-bezier(0.68,-0.55,0.265,1.55) infinite',
        'reader-fade': 'readerFadeIn 0.8s cubic-bezier(0.19,1,0.22,1) forwards',
      },
    },
  },
  plugins: [],
};
export default config;
