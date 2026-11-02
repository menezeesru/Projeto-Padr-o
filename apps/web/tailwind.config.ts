import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E3A5F",
          darker: "#1E293B",
          light: "#EFF6FF",
          lighter: "#DBEAFE"
        },
        background: "#F5F7FA",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        info: "#2563EB"
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
