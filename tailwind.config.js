/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5282',
        secondary: '#63B3ED',
        accent: '#ED8936',
        success: '#48BB78',
        warning: '#F6AD55',
        error: '#FC8181',
        info: '#4299E1',
        surface: '#FFFFFF',
        background: '#F7FAFC',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'elevation': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'elevation-hover': '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}