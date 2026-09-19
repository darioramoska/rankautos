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
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        dark: "var(--dark)",
        mid: "var(--mid)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        warm: "var(--warm)",
        "warm-light": "var(--warm-light)",
        green: "var(--green)",
        yellow: "var(--yellow)",
        red: "var(--red)",
        grad1: "var(--grad-1)",
        grad2: "var(--grad-2)",
        grad3: "var(--grad-3)",
        warm1: "var(--warm-1)",
        warm2: "var(--warm-2)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};
export default config;
