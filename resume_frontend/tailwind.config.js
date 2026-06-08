import themes from 'daisyui/theme/object';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui:{
    themes:["light","dark","night","cupcake","abyss","aqua"]
  },
};

