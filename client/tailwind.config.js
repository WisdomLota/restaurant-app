/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5733', // The orange color from the image
        secondary: '#f8f9fa',
      }
    },
  },
  plugins: [],
}

