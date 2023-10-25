/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
      },
      backgroundImage: {
        'img-login': 'url(\'/public/images/login/login-bg.jpg\')',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: [
      //
    ],
  },
}
