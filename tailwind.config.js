/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F8F6',
          100: '#E8EFEB',
          200: '#CFDDD5',
          300: '#A9C2B5',
          400: '#7A9E8E',
          500: '#5A7A6D',
          600: '#3F5A50',
          700: '#2F4339',
          800: '#1F2D27',
        },
        cream: '#FAF6EE',
        ivory: '#FDFBF6',
        ink: '#2C302E',
        'ink-soft': '#4A4F4D',
        muted: '#87837C',
        gold: {
          DEFAULT: '#C8A878',
          soft: '#E8DCC4',
          deep: '#A48A5C',
        },
        rule: '#D9D2C2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}
