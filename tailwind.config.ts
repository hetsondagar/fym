import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'orbitron': ['Orbitron', 'monospace'],
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
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
        // Cinematic color palette
        'cinema-black': 'hsl(var(--cinema-black))',
        'cinema-dark': 'hsl(var(--cinema-dark))',
        'cinema-red': 'hsl(var(--cinema-red))',
        'cinema-gold': 'hsl(var(--cinema-gold))',
        'cinema-blue': 'hsl(var(--cinema-blue))',
        'cinema-purple': 'hsl(var(--cinema-purple))',
        // Neon palette accents
        'neon-blue': 'hsl(var(--neon-blue))',
        'neon-violet': 'hsl(var(--neon-violet))',
        'neon-cyan': 'hsl(var(--neon-cyan))',
        'neon-teal': 'hsl(var(--neon-teal))',
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        'cinema': 'var(--shadow-cinema)',
        'glow': 'var(--shadow-glow)',
        'neon': 'var(--shadow-neon)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '80%': { transform: 'scale(12)', opacity: '0.2' },
          '100%': { transform: 'scale(14)', opacity: '0' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
        glowPulseOnce: {
          '0%': { boxShadow: '0 0 0px hsl(var(--accent) / 0)' },
          '50%': { boxShadow: '0 0 30px hsl(var(--accent) / 0.7)' },
          '100%': { boxShadow: '0 0 0px hsl(var(--accent) / 0)' },
        },
        shakeSoft: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-1px)' },
          '80%': { transform: 'translateX(1px)' },
        },
        staggerFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ripple: 'ripple 700ms ease-out',
        sweep: 'sweep 900ms ease-in-out',
        glowOnce: 'glowPulseOnce 600ms ease-out',
        shakeSoft: 'shakeSoft 300ms ease-in-out',
        staggerFadeUp: 'staggerFadeUp 700ms ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
