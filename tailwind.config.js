/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf4f0',
          100: '#fbe6dd',
          200: '#f7d0be',
          300: '#f1ad92',
          400: '#e7805d',
          500: '#de5c35',
          600: '#ca4421',
          700: '#a83419',
          800: '#872b18',
          900: '#702718',
          950: '#3d110a',
        },
        clay: {
          50: '#f9f6f0',
          100: '#efece3',
          200: '#ded9c8',
          300: '#c5bea5',
          400: '#a69e80',
          500: '#8a8264',
          600: '#6f684e',
          700: '#57513e',
          800: '#484334',
          900: '#3f3a2f',
          950: '#232019',
        },
        forest: {
          50: '#f4f7f5',
          100: '#e4ede7',
          200: '#ccdcd0',
          300: '#a8c0af',
          400: '#7da088',
          500: '#5c8068',
          600: '#476652',
          700: '#3b5243',
          800: '#324338',
          900: '#2b3930',
          950: '#16201b',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
