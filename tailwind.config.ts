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
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          bg: "#FAF7F2",
          card: "#FFFFFF",
          border: "#EFECE6",
          wood: "#8C6D53",
          woodHover: "#765942",
          orange: "#E88D67",
          orangeHover: "#D67A53",
          sage: "#E3E8E1",
          sageText: "#3D5240",
          peach: "#FCEADE",
          peachText: "#B85536",
          text: "#332C27",
          subtext: "#7A736E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 20px rgba(140, 109, 83, 0.07)",
        'warm-hover': "0 8px 30px rgba(140, 109, 83, 0.12)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
