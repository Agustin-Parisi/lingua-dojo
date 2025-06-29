/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#123624',
          light: '#1e4d33',
          dark: '#0a1d13',
        },
        // Puedes agregar más variantes si lo deseas
      },
    },
  },
  plugins: [],
};
