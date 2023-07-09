/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "570px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      backgroundColor: {
        "navy-blue": "#05445E",
        "navy-blue-2": "#07597a",
        "navy-blue-3": "#0b6e96",
        "navy-blue-4": "#91d1eb",
        "blue-grotto": "#189AB4",
        "blue-green": "#75E6DA",
        "baby-blue": "#b8dfe3",
      },
    },
  },
  plugins: [],
};
