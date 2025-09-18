/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'charcoal-navy': 'var(--charcoal-navy)',
        'dusty-mauve': 'var(--dusty-mauve)',
        'warm-ivory': 'var(--warm-ivory)',
        'clay-pink': 'var(--clay-pink)',
        'garnet': 'var(--garnet)',
      },
      fontFamily: {
        header: 'var(--font-header)',
        body: 'var(--font-body)',
      }
    }
  },
  plugins: []
};