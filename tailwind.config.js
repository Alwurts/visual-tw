/** @type {import('tailwindcss').Config} */
/* import prettierPluginTailwindcss from "prettier-plugin-tailwindcss"; */
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "editor-gray-light": "#333333",
        "editor-gray-medium": "#3c3c3c",
        "editor-gray-dark": "#252526",
        "editor-black": "#1e1e1e",
        "editor-accent": "#007acc",
      },
    },
  },
  plugins: [tailwindScrollbar],
};
