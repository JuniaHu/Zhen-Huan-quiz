/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5F5DC",
        bronze: "#8B4513",
        ink: "#593218",
        sand: "#E9D7B9",
        wine: "#A44A3F",
      },
      boxShadow: {
        card: "0 24px 80px rgba(88, 48, 22, 0.14)",
      },
      fontFamily: {
        display: ['"STZhongsong"', '"Songti SC"', '"Noto Serif SC"', "serif"],
        body: ['"Kaiti SC"', '"STKaiti"', '"Noto Serif SC"', "serif"],
      },
      backgroundImage: {
        mist: "radial-gradient(circle at top, rgba(255,255,255,0.55), transparent 42%), linear-gradient(160deg, #f7efde 0%, #ecd2ae 45%, #d3b189 100%)",
      },
    },
  },
  plugins: [],
};
