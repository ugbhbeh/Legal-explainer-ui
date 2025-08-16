/**  @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D4ED8',
          50: '#E6ECFE',
          100: '#BFCDFC',
          200: '#99AEFA',
          300: '#728FF8',
          400: '#4C70F6',
          500: '#2651F4',
          600: '#1D4ED8',
          700: '#1941B3',
          800: '#15348E',
          900: '#112769'
        },
        surface: '#FFFFFF',
        background: '#F9FAFB',
        accent: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
