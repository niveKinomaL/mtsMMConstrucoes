/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#000000",
        secondaryColor: "#686D76",
        buttonColor: "#e74c3c",
        backgroundColor: "#ffffff",
        backgroundColorDark: "#1A2130",
        textColor: "#2c3e50",
        whiteTextColor: "#ffffff",
      },
    },
  },
  plugins: [],
};
