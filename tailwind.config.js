/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'color-change': {
          '0%': { backgroundColor: '#fff' }, // Blue (base color)
          '50%': { backgroundColor: '#f0f' }, // Green (first hover color)
          '100%': { backgroundColor: '#fff' }, // Orange (second hover color)
        },
      },
      animation: {
        'color-change': 'color-change 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}

