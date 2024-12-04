/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(red|blue|green|yellow|purple|gray|cyan|fuchsia)-\d{3}/,
    },
  ],
};
