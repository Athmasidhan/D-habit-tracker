/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#140746", // For consistent dark purple base
        secondary: "#ff3b3b", // A red accent (used for buttons etc.)
        background: "#180a38", // Landing page background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem",
      },
    },
  },
  plugins: [],
};
