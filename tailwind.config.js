/** @type {import('tailwindcss').Config} */
import { colors } from "./src/lib/theme.ts";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        ...colors,
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0,0,0,0.07)",
        "md-elevated": "0 4px 16px 0 rgba(37,99,235,0.10)",
        "accent-glow": "0 0 12px 2px #10b98155",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        bounceY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20%)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.6s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-out",
        bounceY: "bounceY 1s infinite",
      },
    },
  },
  plugins: [],
};
