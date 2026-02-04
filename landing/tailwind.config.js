/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-orange': '#FF9A76',
        'warm-red': '#FF6B6B',
        'soft-peach': '#FFE5D9',
        'soft-coral': '#FFC8C8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
