/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // This line has changed!
    autoprefixer: {},
  },
};

export default config;