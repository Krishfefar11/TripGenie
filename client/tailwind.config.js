/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── "Aurora" — TripGenie's design system ──────────────────────────
        // Brand identity stays: deep forest-green ink is still the anchor.
        // What's new is a full tonal ramp per accent so color can express
        // hierarchy (subtle tint → solid → deep) instead of one flat value.
        ink: {
          DEFAULT: "#0a1f14",
          soft: "#33463b",
          muted: "#6b7d72",
          faint: "#9aa8a0",
        },
        surface: {
          DEFAULT: "#ffffff",
          sunken: "#f7faf8",
          raised: "#ffffff",
          tint: "#f0f7f3",
          deep: "#06180f",
        },
        line: {
          DEFAULT: "rgba(10,31,20,0.09)",
          strong: "rgba(10,31,20,0.16)",
          faint: "rgba(10,31,20,0.05)",
        },
        // Primary brand accent — emerald/jade, ties to the forest-green ink
        brand: {
          50: "#ecfdf3",
          100: "#d1fae0",
          200: "#a6f4c5",
          300: "#6ee7a8",
          400: "#34d288",
          500: "#12b76a",
          600: "#039855",
          700: "#027a48",
          800: "#05603a",
          900: "#054f31",
        },
        // Secondary accents — each owns a semantic domain in the product
        indigo: {
          100: "#e0e7ff", 300: "#a5b4fc", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
        },
        violet: {
          100: "#ede9fe", 300: "#c4b5fd", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9",
        },
        sky: {
          100: "#e0f2fe", 300: "#7dd3fc", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
        },
        amber: {
          100: "#fef3c7", 300: "#fcd34d", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
        },
        rose: {
          100: "#ffe4e6", 300: "#fda4af", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
        },
        teal: {
          100: "#ccfbf1", 300: "#5eead4", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e",
        },
        success: "#12b76a",
        warning: "#f59e0b",
        error: "#f04438",
      },
      fontFamily: {
        sans: ['"Inter var"', "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ['"Inter var"', "Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Full deliberate scale — every step has a job
        hero:      ["clamp(2.5rem, 4.6vw, 3.875rem)", { lineHeight: "1.06", letterSpacing: "-0.032em", fontWeight: "680" }],
        display:   ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.03em",  fontWeight: "660" }],
        h1:        ["clamp(1.875rem, 3vw, 2.5rem)",  { lineHeight: "1.12", letterSpacing: "-0.024em", fontWeight: "650" }],
        h2:        ["clamp(1.5rem, 2.2vw, 1.875rem)",{ lineHeight: "1.2",  letterSpacing: "-0.019em", fontWeight: "640" }],
        h3:        ["1.125rem",                      { lineHeight: "1.35", letterSpacing: "-0.013em", fontWeight: "620" }],
        lead:      ["clamp(1.0625rem, 1.4vw, 1.1875rem)", { lineHeight: "1.62", letterSpacing: "-0.011em" }],
        body:      ["0.9375rem",                     { lineHeight: "1.68", letterSpacing: "-0.006em" }],
        small:     ["0.875rem",                      { lineHeight: "1.6",  letterSpacing: "-0.004em" }],
        tiny:      ["0.8125rem",                     { lineHeight: "1.5",  letterSpacing: "0" }],
        label:     ["0.75rem",                       { lineHeight: "1.4",  letterSpacing: "0.055em", fontWeight: "600" }],
        caption:   ["0.6875rem",                     { lineHeight: "1.45", letterSpacing: "0.045em", fontWeight: "560" }],
        stat:      ["clamp(1.75rem, 3vw, 2.5rem)",   { lineHeight: "1",    letterSpacing: "-0.03em", fontWeight: "690" }],
        quote:     ["clamp(1.0625rem, 1.6vw, 1.3125rem)", { lineHeight: "1.55", letterSpacing: "-0.014em", fontWeight: "480" }],
      },
      borderRadius: {
        xs: "6px", sm: "10px", DEFAULT: "14px", md: "16px",
        lg: "20px", xl: "26px", "2xl": "32px", "3xl": "40px", pill: "9999px",
      },
      boxShadow: {
        // Layered, tinted with brand green rather than neutral black —
        // keeps depth from reading as gray sludge.
        xs:    "0 1px 2px rgba(10,31,20,0.05)",
        sm:    "0 1px 3px rgba(10,31,20,0.05), 0 1px 2px rgba(10,31,20,0.03)",
        DEFAULT:"0 4px 10px -2px rgba(10,31,20,0.07), 0 2px 6px -2px rgba(10,31,20,0.05)",
        md:    "0 10px 20px -6px rgba(10,31,20,0.10), 0 4px 8px -4px rgba(10,31,20,0.06)",
        lg:    "0 20px 34px -10px rgba(10,31,20,0.13), 0 8px 14px -8px rgba(10,31,20,0.07)",
        xl:    "0 32px 56px -14px rgba(10,31,20,0.17), 0 12px 22px -12px rgba(10,31,20,0.09)",
        "2xl": "0 48px 88px -20px rgba(10,31,20,0.22), 0 18px 32px -16px rgba(10,31,20,0.11)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.7)",
        "glow-brand":  "0 0 0 1px rgba(3,152,85,0.14), 0 8px 26px -6px rgba(3,152,85,0.34)",
        "glow-indigo": "0 0 0 1px rgba(99,102,241,0.14), 0 8px 26px -6px rgba(99,102,241,0.34)",
        "glow-violet": "0 0 0 1px rgba(139,92,246,0.14), 0 8px 26px -6px rgba(139,92,246,0.34)",
        "glow-amber":  "0 0 0 1px rgba(245,158,11,0.16), 0 8px 26px -6px rgba(245,158,11,0.36)",
      },
      backgroundImage: {
        "grad-brand":  "linear-gradient(135deg, #12b76a 0%, #027a48 100%)",
        "grad-jade":   "linear-gradient(135deg, #34d288 0%, #0d9488 100%)",
        "grad-indigo": "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
        "grad-violet": "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
        "grad-sky":    "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
        "grad-amber":  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
        "grad-rose":   "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
        "grad-teal":   "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
        "grad-ink":    "linear-gradient(150deg, #0a1f14 0%, #06180f 60%, #052e1c 100%)",
        "grad-text":   "linear-gradient(115deg, #0a1f14 12%, #039855 52%, #0d9488 88%)",
        "grad-sheen":  "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 50%, transparent 62%)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        crisp:  "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: { fast: "130ms", base: "220ms", slow: "420ms", lazy: "700ms" },
      spacing: { 18: "4.5rem", 22: "5.5rem", 30: "7.5rem", 50: "12.5rem", 70: "17.5rem" },
      maxWidth: { prose: "68ch", shell: "1200px", wide: "1360px" },
      keyframes: {
        "fade-up":   { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in":   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float:       { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-11px)" } },
        "float-slow":{ "0%,100%": { transform: "translateY(0) rotate(0deg)" }, "50%": { transform: "translateY(-18px) rotate(2.5deg)" } },
        "pulse-ring":{ "0%": { transform: "scale(0.85)", opacity: "0.55" }, "70%,100%": { transform: "scale(1.6)", opacity: "0" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        sheen:       { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(120%)" } },
        "dot-bounce":{ "0%,80%,100%": { transform: "translateY(0)", opacity: "0.45" }, "40%": { transform: "translateY(-5px)", opacity: "1" } },
        "bar-grow":  { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
      },
      animation: {
        // `both` fill-mode: holds the hidden 0% during animation-delay and the
        // visible 100% after — so a delayed element never flashes in first.
        // Under prefers-reduced-motion the duration collapses to ~0 and the
        // element lands on its final visible state immediately.
        "fade-up": "fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.24,0,0.38,1) infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "gradient-pan": "gradient-pan 7s ease infinite",
        sheen: "sheen 1.5s cubic-bezier(0.22,1,0.36,1)",
        "dot-bounce": "dot-bounce 1.3s ease-in-out infinite",
        "bar-grow": "bar-grow 0.85s cubic-bezier(0.22,1,0.36,1) both",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
}
