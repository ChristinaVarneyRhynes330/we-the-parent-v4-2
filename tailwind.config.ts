import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // In Tailwind v4, we define the CSS variables here
      // so we can use them directly in the CSS file.
    },
  },
  plugins: [],
}
export default config