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
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
          success: '#10B981',
          danger: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
