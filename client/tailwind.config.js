/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#3F497F",
        colorBorder: "#3F497F",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
