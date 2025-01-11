/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        beige: {
          DEFAULT: '#D4B7A3',
          hover: '#c5a088',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
        }
      },
    },
  },
  plugins: [],
}

