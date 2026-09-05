/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdfa',
          100: '#d2f8f0',
          200: '#a6efe1',
          300: '#6ee0cd',
          400: '#39c7b3',
          500: '#1aab97',
          600: '#0f8b7c',
          700: '#106e64',
          800: '#125650',
          900: '#124643',
          950: '#052b29',
        },
      },
    },
  },
  plugins: [],
}
