/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#01a69f",
        secondary: "#fd3941",
        gray: "#d9d9d9",
        yellow: "#FAD53B",
      },
      fontFamily: {
        sans: ["Paperlogy", "sans-serif"], // 기존
        1: ["font-1", "sans-serif"],
        2: ["font-2", "sans-serif"],
        3: ["font-3", "sans-serif"],
        4: ["font-4", "sans-serif"],
        5: ["font-5", "sans-serif"],
        6: ["font-6", "sans-serif"],
        7: ["font-7", "sans-serif"],
        8: ["font-8", "sans-serif"],
        L: ["font-L", "sans-serif"],
      },
      fontSize: {
        "base-8": "15.8px",
      },
      screens: {
        'custom-819': { 'max': '819px' },
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
      animation: {
        breathe: 'breathe 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
