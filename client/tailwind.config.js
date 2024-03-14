/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#B73E3E",
        colorBorder: "#3F497F",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
