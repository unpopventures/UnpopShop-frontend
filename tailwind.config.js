/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#123526",
          50: "#e8f0ec",
          100: "#c9dcd0",
          200: "#96b9a4",
          300: "#5f9273",
          400: "#2f6d4c",
          500: "#123526",
          600: "#0f2c20",
          700: "#0b2219",
          800: "#081812",
          900: "#050f0b",
        },
        cream: {
          DEFAULT: "#FAF3E4",
          50: "#FFFDF9",
          100: "#FAF3E4",
          200: "#F3E7D0",
          300: "#EAD8B4",
        },
        gold: {
          DEFAULT: "#C0923D",
          50: "#F8EEDB",
          100: "#EFDCB6",
          400: "#C99A3E",
          500: "#C0923D",
          600: "#9C7530",
          700: "#7A5A25",
        },
        peacock: {
          DEFAULT: "#1F6F78",
          light: "#3E97A0",
          dark: "#134B52",
        },
        terracotta: "#B5651D",
        ink: "#16241C",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,53,38,0.06), 0 8px 24px -12px rgba(18,53,38,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
