import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda9a5',
          400: '#fb7871',
          500: '#f25042',
          600: '#df3526',
          700: '#bc291c',
          800: '#9b251b',
          900: '#80251d',
        },
        bakery: {
          cream: '#FFF8F0',
          chocolate: '#4A2C2A',
          caramel: '#C19A6B',
          rose: '#FF6B9D',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
