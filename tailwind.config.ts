import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep midnight — premium, trust
        midnight: {
          50: "#f5f6fa",
          100: "#e8eaf3",
          200: "#c4c9de",
          300: "#9ea5c3",
          500: "#4a5383",
          700: "#1a1f47",
          800: "#0f1330",
          900: "#0a0e27",
          950: "#060818",
        },
        // Saffron — energy, trucks, India
        saffron: {
          50: "#fff4ed",
          100: "#ffe4d2",
          200: "#ffc4a3",
          300: "#ff9c6a",
          400: "#ff7a3d",
          500: "#ff6b35",
          600: "#f04e15",
          700: "#c73a0f",
          800: "#9e3014",
          900: "#7f2a14",
        },
        // Cream — warmth
        cream: {
          50: "#fffbf5",
          100: "#fef7ed",
          200: "#fdeed5",
          300: "#fbe1b4",
        },
        // Mint — success, fresh
        mint: {
          400: "#34e3b5",
          500: "#00d9a3",
          600: "#00b386",
        },
        // Legacy aliases for other pages (keep them working)
        brand: {
          50: "#fff4ed",
          100: "#ffe4d2",
          500: "#ff6b35",
          600: "#f04e15",
          700: "#c73a0f",
          900: "#0a0e27",
        },
        ink: {
          900: "#0a0e27",
          700: "#1a1f47",
          500: "#4a5383",
          300: "#9ea5c3",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(10, 14, 39, 0.12)",
        glow: "0 20px 60px -20px rgba(255, 107, 53, 0.5)",
        "glow-mint": "0 20px 60px -20px rgba(0, 217, 163, 0.45)",
        brutal: "6px 6px 0 0 rgba(10,14,39,1)",
        "brutal-saffron": "6px 6px 0 0 rgba(255,107,53,1)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "truck-drive": "truckDrive 8s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "ping-slow": "pingSlow 3s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        truckDrive: {
          "0%": { transform: "translateX(-10%)" },
          "45%": { transform: "translateX(65%)" },
          "55%": { transform: "translateX(65%)" },
          "100%": { transform: "translateX(-10%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "0.9" },
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      backgroundImage: {
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
