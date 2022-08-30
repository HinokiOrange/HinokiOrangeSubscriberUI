module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#815438",
        "primary-light": "#b38163",
        "primary-dark": "#522b11",
        secondary: "#ff7043",
        "secondary-light": "#ffa270",
        "secondary-dark": "#c63f17",
        "primary-text": "#ffffff",
        "secondary-text": "#000000",
      },
    },
  },
  plugins: [],
};
