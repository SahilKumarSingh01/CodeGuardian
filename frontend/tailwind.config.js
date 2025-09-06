// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        testcolor: '#ff00ff', // bright magenta so it’s obvious
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
