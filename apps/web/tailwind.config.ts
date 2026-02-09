import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nike Brand Colors (2026 Refresh)
        primary: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#CCFF00", // Volt
          hover: "#B3E600",
          foreground: "#111111", // Black on Volt
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F5F5F7", // Off-white
          dark: "#111111",
        },
        foreground: {
          DEFAULT: "#111111",
          muted: "#707072",
          light: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E5E5",
          dark: "#333333",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["6rem", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-xl": ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-md": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "nike": "9999px", // Pill shape
        "card": "16px", // Slightly sharper than 20px
      },
      boxShadow: {
        "nike": "0 20px 40px -10px rgba(0,0,0,0.1)", // Softer, more spread
        "nike-hover": "0 30px 60px -15px rgba(0,0,0,0.15)",
        "product": "0 10px 30px -10px rgba(0,0,0,0.05)",
        "glow": "0 0 20px rgba(204, 255, 0, 0.5)", // Volt glow
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "marquee": "marquee 25s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;

