module.exports = {
  darkMode: 'class',
  content: ["./templates/**/*.html"],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'Helvetica', 'sans-serif'],
    }
  },
  variants: {},
  plugins: [
      require('@tailwindcss/typography'),
  ],
}
