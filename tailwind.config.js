module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': "var(--primary-color)",
        'lighter-primary-color': "var(--lighter-primary-color)",
        'lightest-primary-color': "var(--lightest-primary-color)",
        'darker-primary-color': "var(--darker-primary-color)",
        'secondary-color': "var(--secondary-color)",
        'tertiary-color': "var(--tertiary-color)",
        'light-color': "var(--light-color)",
        'error-color': "var(--error-color)",
        'error-bg-color': "var(--error-bg-color)",
        'success-color': "var(--success-color)",
        'success-bg-color': "var(--success-bg-color)",
      },
      fontFamily: {
        'magic': ['Magic'],
        'medievalsharp': ['MedievalSharp'],
        'oswald': ['Oswald'],
      },
      screens: {
        'xs': '480px',
      },
      spacing: {
        '0/1': '0%',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '1/1': '100%',
        '5/4': '125%',
        '3/2': '150%',
        '2/1': '200%',
      },
    }
  },
  plugins: [],
}