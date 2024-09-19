/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'color-change': {
          '0%': { backgroundColor: colors.white },
          '50%': { backgroundColor: colors.gray['500'] },
          '100%': { backgroundColor: colors.gray['300'] },
        },
      },
      animation: {
        'color-change': 'color-change 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
}

