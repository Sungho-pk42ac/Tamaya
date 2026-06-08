import type { Config } from "tailwindcss";

// DESIGN.md / geongangnyang-ui.html 흙빛 팔레트를 Tailwind 토큰으로 포팅
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f4ecd9",
        paper: "#ece0c7",
        "paper-hi": "#f6eeda",
        beige: "#dccba6",
        coffee: "#6b4f3a",
        "coffee-deep": "#4f3927",
        ink: "#3a2e24",
        terracotta: "#c46a43",
        "terracotta-deep": "#a8542f",
        espresso: "#221a14",
        "espresso-soft": "#322419",
        "espresso-card": "#2c2117",
        "night-cream": "#efe4ce",
        amber: "#e3a85b",
        "amber-soft": "#c79150",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "sans-serif"],
        serif: ['"Gowun Batang"', "serif"],
        hand: ['"Gaegu"', "cursive"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
