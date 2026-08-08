/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f0f7f4",
          100: "#dceee4",
          200: "#b8ddc9",
          300: "#8cc5a8",
          400: "#5fa882",
          500: "#3d8b66",
          600: "#2d6f51",
          700: "#255a43",
          800: "#1f4837",
          900: "#1a3d2f",
          950: "#0d2219",
        },
      },
    },
  },
  plugins: [],
};
