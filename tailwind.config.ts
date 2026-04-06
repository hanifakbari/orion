import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-primary": "rgb(var(--bg-primary) / <alpha-value>)",
        "bg-secondary": "rgb(var(--bg-secondary) / <alpha-value>)",
        "accent-cyan": "rgb(var(--accent-cyan) / <alpha-value>)",
        "accent-green": "rgb(var(--accent-green) / <alpha-value>)",
        "accent-amber": "rgb(var(--accent-amber) / <alpha-value>)",
        "accent-red": "rgb(var(--accent-red) / <alpha-value>)",
        critical: "rgb(var(--critical) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",

        "border-custom": "var(--border-color)",
        surface: "var(--surface-color)",
        "surface-hover": "var(--surface-hover-color)",
        "surface-active": "var(--surface-active-color)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "bg-pulse": "bgPulse 10s ease-in-out infinite",
        "pulse-dot": "pulse 2s infinite",
        "slide-up": "slideUp 0.3s ease",
        shake: "shake 0.5s ease-in-out",
        "danger-pulse": "dangerPulse 2s infinite",
        "critical-pulse": "criticalPulse 1s infinite",
        "dot-wave": "dotWave 1.2s ease-in-out infinite",
      },
      keyframes: {
        bgPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(10deg)" },
        },
        dangerPulse: {
          "0%, 100%": { boxShadow: "0 0 0 4px rgb(var(--accent-red) / 0.3)" },
          "50%": { boxShadow: "0 0 0 8px rgb(var(--accent-red) / 0.3)" },
        },
        criticalPulse: {
          "0%, 100%": { boxShadow: "0 0 0 4px rgb(var(--critical) / 0.3)" },
          "50%": { boxShadow: "0 0 0 10px rgb(var(--critical) / 0.5)" },
        },
        dotWave: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.85" },
          "50%": { transform: "translateY(-6px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
