import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7fa",
          100: "#d6e8ef",
          200: "#aed1df",
          300: "#7ab3c8",
          400: "#4a8fa8",
          500: "#1a3c4a",
          600: "#163441",
          700: "#122c37",
          800: "#0e232d",
          900: "#0a1a22",
        },
        accent: {
          50: "#f0f7fa",
          100: "#d6e8ef",
          200: "#aed1df",
          300: "#7ab3c8",
          400: "#4a8fa8",
          500: "#1a3c4a",
          600: "#163441",
        },
      },
    },
  },
  plugins: [],
};
export default config;
