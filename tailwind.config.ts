import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep purple — premium, trust (from logo truck)
        midnight: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          500: "#7c3aed",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b0764",
          950: "#2e0547",
        },
        // Teal — energy, movement (from logo gradient)
        saffron: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        // Cream — warmth, background
        cream: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
        },
        // Green — success, peacock feather
        mint: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        // Legacy aliases for other pages (keep them working)
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          900: "#3b0764",
        },
        ink: {
          900: "#3b0764",
          700: "#5b21b6",
          500: "#7c3aed",
          300: "#c4b5fd",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(59, 7, 100, 0.12)",
        glow: "0 20px 60px -20px rgba(20, 184, 166, 0.5)",
        "glow-mint": "0 20px 60px -20px rgba(34, 197, 94, 0.45)",
        brutal: "6px 6px 0 0 rgba(59,7,100,1)",
        "brutal-saffron": "6px 6px 0 0 rgba(20,184,166,1)",
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
  plugins: [
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#ddd6fe transparent",
        },
        ".scrollbar-thin::-webkit-scrollbar": { width: "4px" },
        ".scrollbar-thin::-webkit-scrollbar-track": { background: "transparent" },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          background: "#ddd6fe",
          "border-radius": "99px",
        },
      });
    },
  ],
};
export default config;
