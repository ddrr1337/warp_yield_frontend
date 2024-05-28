import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,jsx,ts,tsx,md,mdx}'
  ],
  theme: {},
  plugins: [require("tailgrids/plugin")],
};
export default config;
