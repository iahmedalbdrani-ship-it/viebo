import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C3BFF",
        secondary: "#00D9FF",
        accent: "#FF006E",
        dark: "#0A0E27",
        surface: "#1A1F3A",
        "surface-light": "#252A4A",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A0A3BD",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s infinite",
        "float-in": "float-in 0.3s ease-out",
        "scale-tap": "scale-tap 0.1s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 rgba(108, 59, 255, 0)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 20px rgba(108, 59, 255, 0.8)",
          },
        },
        "float-in": {
          "0%": {
            transform: "translateY(20px) scale(0.8)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            opacity: "1",
          },
        },
        "scale-tap": {
          "0%": { transform: "scale(1.15)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
