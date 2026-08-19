/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0a2e1c",
        "brand-light": "#12503a",
        gold: "#ffd700",
      },
    },
  },
  plugins: [],
};