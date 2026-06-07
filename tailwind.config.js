module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#050816",
        panel: "#0f172a",
        paper: "#f8fbff",
        gold: "#38bdf8",
        plum: "#7c3aed",
        teal: "#14b8a6",
        rose: "#fb7185"
      },
      boxShadow: {
        glow: "0 24px 78px rgba(56, 189, 248, 0.22)",
        violet: "0 22px 70px rgba(124, 58, 237, 0.2)"
      }
    }
  },
  plugins: []
};
