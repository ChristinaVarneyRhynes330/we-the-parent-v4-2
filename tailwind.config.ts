import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your custom brand colors
        'charcoal-navy': '#1E1F2F',
        'dusty-mauve': '#A05C6F',
        'warm-ivory': '#FDF7F2',
        'clay-pink': '#D8A7A0',
        'garnet': '#B03A48',
        'olive-emerald': '#6B8E23',
        'terracotta': '#E2725B',
        'slate-gray': '#708090',
      },
      fontFamily: {
        'header': ['var(--font-header)', 'serif'],
        'body': ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #A05C6F 0%, #B03A48 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FDF7F2 0%, #D8A7A0 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(160, 92, 111, 0.1)',
        'brand-lg': '0 10px 25px 0 rgba(160, 92, 111, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config