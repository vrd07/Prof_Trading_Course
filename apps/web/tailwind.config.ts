import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        'background-subtle': 'hsl(var(--background-subtle))',
        'background-muted': 'hsl(var(--background-muted))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        destructive: 'hsl(var(--destructive))',
        orange: 'hsl(var(--orange))',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
}

export default config

