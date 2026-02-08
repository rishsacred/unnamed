import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8ff",
          100: "#deeeff",
          200: "#b6d7ff",
          300: "#8bbfff",
          400: "#5a9bff",
          500: "#2f76ff",
          600: "#1653d4",
          700: "#123ea3",
          800: "#0e2c72",
          900: "#0b2154"
        }
      }
    }
  },
  plugins: []
};

export default config;
