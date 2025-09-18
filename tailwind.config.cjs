// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'charcoal-navy': '#1E1F2F',
        'dusty-mauve': '#A05C6F',
        'warm-ivory': '#FDF7F2',
        'clay-pink': '#D8A7A0',
        'garnet': '#B03A48',
        'olive-emerald': '#4C7C59',
        'terracotta': '#D97A4C',
        'slate-gray': '#6E6E73',
      },
      fontFamily: {
        header: ['DM Serif Display', 'serif'],
        body: ['Work Sans', 'sans-serif'],
        accent: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};