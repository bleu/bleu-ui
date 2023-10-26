const CLASSES_PREFIX = 'ui-';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  prefix: CLASSES_PREFIX,
  corePlugins: {
    preflight: false,
  },
  darkMode: ['class', 'html[class~="dark"]'],
};
