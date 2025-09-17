/** tailwind.config.cjs */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  safelist: [
    // explicit names
    'bg-cream','bg-navy','bg-sapphire','bg-burgundy','bg-blush','bg-midnight-navy',
    'text-cream','text-navy','text-sapphire','text-burgundy','text-blush','text-rose-gold',
    'hover:text-rose-gold','btn-primary','btn-secondary','card',
    // utilities commonly used in markup
    'px-4','py-2','p-4','p-6','mb-4','mt-4','mr-2','rounded','rounded-lg'
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0B1A2A',
        'sapphire': '#1F3A93',
        'burgundy': '#800020',
        'blush': '#F7CAC9',
        'rose-gold': '#B76E79',
        'cream': '#FAF7F2',
        'midnight-navy': '#0D223F',
        'light-ivory': '#F5F5F5'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
