/* eslint-disable no-undef */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        islamic: {
          light: "#8AB4B1",
          DEFAULT: "#1B4242",
          dark: "#092635",
        },
      },
      fontFamily: {
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
    },
  },
  darkMode: "class", // Explicitly set to 'class'
  plugins: [
    require("daisyui"), // Add daisyUI as a plugin
  ],
  daisyui: {
    themes: ["light", "dark"], // Keep light and dark themes
  },
};
