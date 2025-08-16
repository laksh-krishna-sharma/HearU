/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean': {
          'primary': '#6BCB77',
          'secondary': '#4D96FF', 
          'accent': '#FF6B6B',
          'background': '#F1FAEE',
          'text': '#2C3E50',
          'navbar': '#F0FCF2',
          'primary-light': '#7DD87F',
          'primary-dark': '#5BB965',
          'secondary-light': '#6BA6FF',
          'secondary-dark': '#3D86EF',
          'accent-light': '#FF7F7F',
          'accent-dark': '#FF5757',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'wave': 'wave 6s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}