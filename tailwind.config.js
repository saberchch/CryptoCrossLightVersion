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
      },
      boxShadow: {
        'gold-soft': '0 10px 20px -10px rgba(245, 158, 11, 0.35), 0 6px 12px -8px rgba(217, 119, 6, 0.25)',
        'gold-strong': '0 12px 28px rgba(245, 158, 11, 0.35), 0 8px 16px rgba(217, 119, 6, 0.25)'
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(1200px circle at 0% 0%, rgba(252, 211, 77, 0.25), transparent 40%), radial-gradient(1200px circle at 100% 0%, rgba(245, 158, 11, 0.20), transparent 40%)',
        'gold-linear': 'linear-gradient(135deg, rgba(252, 211, 77, 0.2) 0%, rgba(245, 158, 11, 0.12) 50%, rgba(217, 119, 6, 0.12) 100%)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(245, 158, 11, 0.0)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
