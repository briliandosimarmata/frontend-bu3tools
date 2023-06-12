/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      height: {
        '88': '22rem',
      },
      lineHeight: {
        'zero': '0',
        'attached': '0.5'
      }
    },
  },
  plugins: [],
}
