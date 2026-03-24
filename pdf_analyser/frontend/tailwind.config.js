/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // Slate 900
        primary: '#7C3AED',    // Violet 600
        accent: '#22D3EE',     // Cyan 400
        cards: '#1E293B',      // Slate 800
        text: '#E5E7EB',       // Gray 200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming we import Inter later or use system default for now
      },
    },
  },
  plugins: [],
}
