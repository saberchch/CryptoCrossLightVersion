/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          primary: '#F59E0B',
          secondary: '#D97706',
          accent: '#FCD34D',
          success: '#10B981',
          danger: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
