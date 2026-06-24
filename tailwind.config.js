export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        clinical: {
          teal: '#0E7490',
          darkteal: '#0F766E',
          navy: '#0F172A',
          light: '#F8FAFC',
          mint: '#34D399',
          soothing: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
