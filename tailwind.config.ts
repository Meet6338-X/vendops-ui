import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          panel: "var(--panel)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          muted: "var(--foreground-muted)",
        },
        border: "var(--border)",
        industrial: {
          base: "#09090B",
          panel: "rgba(24, 24, 27, 0.9)",
          subtle: "#18181B",
          border: "rgba(63, 63, 70, 0.4)",
          highlight: "rgba(255, 255, 255, 0.05)",
        },
        brand: {
          blue: "#3b82f6",
          emerald: "#10b981",
          orange: "#f97316",
          red: "#ef4444",
          cyan: "#00f2fe",
          purple: "#a855f7",
        },
      },
      borderRadius: {
        "3xl": "24px",
        "2xl": "16px",
        xl: "12px",
        lg: "8px",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fadeIn 0.25s ease-in-out",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
