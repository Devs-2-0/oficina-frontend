/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(0 0% 89.8%)', // Valor de --border em :root
        input: 'hsl(0 0% 89.8%)', // Valor de --input em :root
        ring: 'hsl(0 0% 3.9%)', // Valor de --ring em :root
        background: 'hsl(0 0% 100%)', // Valor de --background em :root
        foreground: 'hsl(0 0% 3.9%)', // Valor de --foreground em :root
        primary: {
          DEFAULT: 'hsl(0 0% 9%)', // Valor de --primary em :root
          foreground: 'hsl(0 0% 98%)', // Valor de --primary-foreground em :root
        },
        secondary: {
          DEFAULT: 'hsl(0 0% 96.1%)', // Valor de --secondary em :root
          foreground: 'hsl(0 0% 9%)', // Valor de --secondary-foreground em :root
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)', // Valor de --destructive em :root
          foreground: 'hsl(0 0% 98%)', // Valor de --destructive-foreground em :root
        },
        muted: {
          DEFAULT: 'hsl(0 0% 96.1%)', // Valor de --muted em :root
          foreground: 'hsl(0 0% 45.1%)', // Valor de --muted-foreground em :root
        },
        accent: {
          DEFAULT: 'hsl(0 0% 96.1%)', // Valor de --accent em :root
          foreground: 'hsl(0 0% 9%)', // Valor de --accent-foreground em :root
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)', // Valor de --popover em :root
          foreground: 'hsl(0 0% 3.9%)', // Valor de --popover-foreground em :root
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)', // Valor de --card em :root
          foreground: 'hsl(0 0% 3.9%)', // Valor de --card-foreground em :root
        },
      },
      borderRadius: {
        lg: '0.5rem', // Valor de --radius em :root
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // plugins: [require('@tailwindcss/animate')],
  plugins: [],
};