/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        coffee: {
          light: "#D4BBA7",
          DEFAULT: "#A67B5B",
          dark: "#744C24",
        },
        black: "#444444",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  }
}

