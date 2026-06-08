import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F3',
          100: '#F7F4EE',
          200: '#EAE4D9',
          300: '#D4CDC0',
        },
        ink: {
          DEFAULT: '#1E1B17',
          soft: '#2A2620',
          muted: '#6F665A',
          subtle: '#9A9183',
        },
        brass: {
          DEFAULT: '#9A7B4F',
          light: '#B89668',
          dark: '#7A6038',
        },
        olive: {
          DEFAULT: '#4A5240',
          dark: '#363D2E',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'serif-he': ['var(--font-serif-he)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'editorial': '0.15em',
        'wider-em': '0.25em',
      },
      maxWidth: {
        'reading': '65ch',
        'editorial': '1440px',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'marquee': 'marquee 38s linear infinite',
        'marquee-reverse': 'marqueeReverse 38s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
