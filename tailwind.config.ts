import type { Config } from 'tailwindcss';

/**
 * KanziVape tasarım token'ları — açık, editoryal tema.
 *
 * Sıcak kağıt zemin, mürekkep metin, çivit (aizome) ana eylem rengi ve
 * vermilyon kampanya rengi. Bileşenler ham hex değil, buradaki anlamsal
 * adları kullanır. Kontrast: `fg` ve `muted` zeminde 4.5:1'in üzerinde;
 * `accent` üzerinde metin `accent-ink` (beyaz).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2.5rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        bg: '#F3EFE7',
        surface: { DEFAULT: '#FFFFFF', 2: '#EAE5DA', 3: '#E0D9CB' },
        line: { DEFAULT: '#DCD5C7', strong: '#C4BBA8' },
        fg: '#15171D',
        muted: '#555A66',
        subtle: '#7E818B',
        accent: { DEFAULT: '#2436A8', hover: '#1B2A8A', ink: '#FFFFFF', soft: 'rgba(36,54,168,0.09)' },
        hazard: { DEFAULT: '#FF5A36', soft: 'rgba(255,90,54,0.12)' },
        danger: { DEFAULT: '#C9302A', soft: 'rgba(201,48,42,0.09)' },
        success: { DEFAULT: '#1E7F4C', soft: 'rgba(30,127,76,0.10)' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(2rem, 3.6vw, 2.9rem)', { lineHeight: '0.98' }],
        'display-md': ['clamp(2.6rem, 5.8vw, 4.5rem)', { lineHeight: '0.95' }],
        'display-lg': ['clamp(4.5rem, 16vw, 14rem)', { lineHeight: '0.82', letterSpacing: '-0.01em' }],
      },
      borderRadius: { xl: '0.5rem', '2xl': '0.625rem', '3xl': '0.875rem' },
      boxShadow: {
        glow: '0 12px 28px -14px rgba(36,54,168,0.6)',
        lift: '0 24px 50px -24px rgba(21,23,29,0.35)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'none' } },
        pulse: { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-slow': 'pulse 3.2s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
