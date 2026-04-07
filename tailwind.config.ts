import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode mặc định theo class — thêm class "dark" vào <html>
  darkMode: ["class"],

  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────────────────
      fontFamily: {
        sans:    ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono:    ["IBM Plex Mono", "Fira Code", "Cascadia Code", "monospace"],
        numeric: ["IBM Plex Mono", "monospace"], // alias cho số tài chính
      },

      // ── Colors — map đầy đủ từ CSS variables ───────────────
      colors: {
        background:  "var(--background)",
        foreground:  "var(--foreground)",

        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border:     "var(--border)",
        input:      "var(--input)",
        ring:       "var(--ring)",

        // ── Stock semantic tokens ──
        bull: {
          DEFAULT:    "var(--bull)",
          muted:      "var(--bull-muted)",
          foreground: "var(--bull-foreground)",
        },
        bear: {
          DEFAULT:    "var(--bear)",
          muted:      "var(--bear-muted)",
          foreground: "var(--bear-foreground)",
        },
        neutral: {
          DEFAULT:    "var(--neutral)",
          muted:      "var(--neutral-muted)",
          foreground: "var(--neutral-foreground)",
        },
        signal: {
          buy:  "var(--signal-buy)",
          sell: "var(--signal-sell)",
          hold: "var(--signal-hold)",
        },
        candle: {
          bull:      "var(--candle-bull)",
          bullWick:  "var(--candle-bull-wick)",
          bear:      "var(--candle-bear)",
          bearWick:  "var(--candle-bear-wick)",
        },

        // ── Chart palette ──
        chart: {
          1:  "var(--chart-1)",
          2:  "var(--chart-2)",
          3:  "var(--chart-3)",
          4:  "var(--chart-4)",
          5:  "var(--chart-5)",
          6:  "var(--chart-6)",
          7:  "var(--chart-7)",
          8:  "var(--chart-8)",
          9:  "var(--chart-9)",
          10: "var(--chart-10)",
        },

        // ── Gray scale ──
        gray: {
          50:  "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
      },

      // ── Border radius ───────────────────────────────────────
      borderRadius: {
        sm:  "calc(var(--radius) - 4px)", // 8px
        md:  "calc(var(--radius) - 2px)", // 10px
        lg:  "var(--radius)",             // 12px — default card
        xl:  "calc(var(--radius) + 4px)", // 16px
        "2xl": "calc(var(--radius) + 8px)", // 20px
      },

      // ── Font sizes — bổ sung price display sizes ────────────
      fontSize: {
        "price-xs": ["0.75rem",  { fontWeight: "400", fontFamily: "IBM Plex Mono, monospace" }],
        "price-sm": ["0.875rem", { fontWeight: "500", fontFamily: "IBM Plex Mono, monospace" }],
        "price-md": ["1rem",     { fontWeight: "500", fontFamily: "IBM Plex Mono, monospace" }],
        "price-lg": ["1.5rem",   { fontWeight: "600", fontFamily: "IBM Plex Mono, monospace" }],
        "price-xl": ["2rem",     { fontWeight: "600", fontFamily: "IBM Plex Mono, monospace" }],
      },

      // ── Spacing bổ sung ─────────────────────────────────────
      spacing: {
        sidebar:           "240px",
        "sidebar-collapsed": "64px",
        header:            "56px",
      },

      // ── Width/height shorthand ──────────────────────────────
      width: {
        sidebar:           "240px",
        "sidebar-collapsed": "64px",
      },
      height: {
        header: "56px",
      },

      // ── Animation ───────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "pulse-bull": {
          "0%, 100%": { color: "var(--bull)" },
          "50%":      { color: "var(--bull-foreground)" },
        },
        "pulse-bear": {
          "0%, 100%": { color: "var(--bear)" },
          "50%":      { color: "var(--bear-foreground)" },
        },
      },
      animation: {
        "fade-in":        "fade-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
        "pulse-bull":     "pulse-bull 1s ease-in-out infinite",
        "pulse-bear":     "pulse-bear 1s ease-in-out infinite",
      },
    },
  },

  // plugins handled via @plugin directive in globals.css (Tailwind v4)
  plugins: [],
};

export default config;
