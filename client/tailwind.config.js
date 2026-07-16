/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1a14",
        "ink-secondary": "#7a7468",
        pearl: "#f6f0dd",
        "pearl-lift": "#ece5d3",
        hairline: "rgba(29,26,20,0.10)",
        divider: "rgba(29,26,20,0.14)",
        sage: "#5a6238",
        success: "#3a8c5c",
        error: "#c4493a",
        // legacy aliases kept for gradual migration
        primary: "#5a6238",
        dark: "#1d1a14",
        light: "#f6f0dd",
      },
      fontFamily: {
        display: ['"Cormorant Infant"', "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        hero: ["8rem", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "hero-sm": ["3.25rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        h1: ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "h1-sm": ["2.75rem", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        h2: ["2rem", { lineHeight: "1.18", letterSpacing: "-0.018em" }],
        quote: ["1.75rem", { lineHeight: "1.3", letterSpacing: "-0.012em" }],
        body: ["1.0625rem", { lineHeight: "1.7", letterSpacing: "-0.005em" }],
        ui: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.16em" }],
        caption: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.10em" }],
        data: ["0.875rem", { lineHeight: "1", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sm: "1px",
        DEFAULT: "2px",
        md: "2px",
        lg: "3px",
        pill: "9999px",
      },
      boxShadow: {
        none: "none",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
      },
      spacing: {
        50: "200px",
        70: "280px",
      },
      animation: {
        'fade-in': 'fadeIn 0.2s linear forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
