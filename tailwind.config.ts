import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // shadcn semantic tokens (mapped to ALTR palette via CSS vars)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ALTR brand palette — overrides Tailwind defaults
        teal: {
          50: "#ECF8F3",
          100: "#D1F0E2",
          200: "#A5E1C5",
          300: "#71CFA4",
          400: "#41B888",
          500: "#25A87C",
          600: "#1D9E75",
          700: "#197F5E",
          800: "#145F47",
          900: "#103D2E",
        },
        purple: {
          50: "#EEECFA",
          100: "#DDD8F2",
          200: "#BAB1E6",
          300: "#978AD9",
          400: "#7565C9",
          500: "#6056BF",
          600: "#534AB7",
          700: "#423D94",
          800: "#353074",
          900: "#2A265B",
        },
        gray: {
          50: "#F1EFE8",
          100: "#E9E6DD",
          200: "#DAD7CB",
          300: "#BFBBAD",
          400: "#948F80",
          500: "#6E6A5E",
          600: "#514F46",
          700: "#3F3D37",
          800: "#34322D",
          900: "#2C2C2A",
        },

        // ALTR demo subsection — dark / yellow / mono Bloomberg-terminal aesthetic.
        // Used only by /demo/* routes (see app/(demo)/demo/layout.tsx).
        // Exception: altr.pink is the cross-theme brand mark, used in both
        // marketing nav/footer and on the logo composition.
        altr: {
          black: "#08080d",
          panel: "#10101a",
          line: "#1a1a26",
          line2: "#26262f",
          white: "#f5f5f0",
          mute: "#5e5e6a",
          muteSoft: "#a5a5b0",
          yellow: "#ffd60a",
          green: "#3fb86b",
          pink: "#FF3DD1",
          lime: "#C8F04A",
        },
      },
      fontSize: {
        // ALTR type scale
        caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.06em" }],
        body: ["15px", { lineHeight: "1.6" }],
        h3: ["18px", { lineHeight: "1.4" }],
        stat: ["32px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h2: ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        h1: ["36px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      borderWidth: {
        DEFAULT: "0.5px",
        hairline: "0.5px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
