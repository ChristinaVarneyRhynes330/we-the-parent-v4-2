import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{css}"],
  theme: {
    extend: {
      colors: {
        // Brand palette pulled from your badge
        navy:  "#13293D",
        rust:  "#B44B32",
        cream: "#F8F5EF",
        ivory: "#FBF9F6",

        // neutrals used consistently
        paper: "#FFFFFF",
        ink:   "#0E1A21",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Arial"],
        serif: ["Source Serif Pro", "ui-serif", "Georgia"],
      },
      borderRadius: {
        // slightly tighter than before
        md: "0.5rem",
        xl: "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(19,41,61,0.06), 0 8px 24px -12px rgba(19,41,61,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
