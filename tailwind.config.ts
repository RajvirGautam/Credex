import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8f8f7",
          100: "#eeedea",
          200: "#d8d6d0",
          300: "#b9b5ac",
          400: "#8a857a",
          500: "#5e5a52",
          600: "#403d37",
          700: "#2a2824",
          800: "#1a1916",
          900: "#0e0d0b",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bcd2ff",
          300: "#8db4ff",
          400: "#5b8bff",
          500: "#3d6bff",
          600: "#2a4ff5",
          700: "#1f3dd1",
          800: "#1c34a3",
          900: "#1a2f80",
        },
        accent: {
          DEFAULT: "#0a7d4f",
          dark: "#075c3a",
        },
        warn: "#a25b00",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(20, 30, 80, 0.18)",
        chip: "0 8px 24px -8px rgba(20, 30, 80, 0.25)",
        lift: "0 24px 48px -20px rgba(20, 30, 80, 0.30)",
      },
      animation: {
        "float-a": "floatA 11s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "float-b": "floatB 13s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "float-c": "floatC 9s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "drift":   "drift 18s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "halo":    "halo 14s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
        "marquee": "marquee 26s linear infinite",
        "bob":     "bob 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite",
      },
      keyframes: {
        floatA: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%":      { transform: "translate3d(0, -8px, 0)" },
        },
        floatB: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%":      { transform: "translate3d(2px, -10px, 0)" },
        },
        floatC: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%":      { transform: "translate3d(-2px, -6px, 0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%":      { transform: "translate3d(0, -6px, 0) scale(1.015)" },
        },
        halo: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%":      { opacity: "1",    transform: "scale(1.04)" },
        },
        marquee: {
          "0%":   { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        bob: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%":      { transform: "translate3d(0, 6px, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
