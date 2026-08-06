/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jk: {
          yellow: '#FFC800',
          'yellow-hover': '#E6B400',
          dark: '#0F172A',
          navy: '#1E293B',
          card: '#1E293B',
          accent: '#0284C7',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
