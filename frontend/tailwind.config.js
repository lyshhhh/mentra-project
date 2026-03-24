/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1E40AF",
        secondary: "#EFF6FF",
        textDark: "#1F2937"
      }
    }
  },
  plugins: []
};