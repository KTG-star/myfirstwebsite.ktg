/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bloom-green': '#2d5a27',
        'bloom-pink': '#f2c4ce',
        'bloom-cream': '#fdf8f0',
        'bloom-gold': '#c9a84c',
        'bloom-lavender': '#e8d5f5',
        'bloom-deep': '#1a1a2e',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        dmsans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'petal-fall': 'fall 10s linear infinite',
        'aurora': 'aurora 20s infinite linear',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}
