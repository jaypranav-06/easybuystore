import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003049",
          light: "#219ebc",
          dark: "#001d3d",
        },
        secondary: {
          DEFAULT: "#8ecae6",
          light: "#f1faff",
        },
      },
    },
  },
  plugins: [],
};
export default config;
