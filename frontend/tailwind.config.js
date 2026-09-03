/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDFBF7',  // Warm cream background
          100: '#F7F2EA', // Light beige card
          200: '#EFE5D5', // Border warm accent
          500: '#E86A33', // Saffron primary accent
          600: '#D2551E', // Dark saffron hover
          700: '#B03F10',
          green: '#2E7D32', // Leaf green
          greenLight: '#E8F5E9',
          amber: '#F59E0B',
          amberLight: '#FEF3C7',
          blue: '#2563EB',
          blueLight: '#EFF6FF',
          dark: '#1C1917',   // Charcoal dark text
          slate: '#44403C'  // Slate secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
