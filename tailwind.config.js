module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#07111f",
        panel: "#0f172a",
        paper: "#f7fbff",
        gold: "#22d3ee",
        plum: "#6366f1",
        teal: "#10b981",
        rose: "#fb7185"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(34, 211, 238, 0.18)",
        violet: "0 20px 70px rgba(99, 102, 241, 0.22)"
      }
    }
  },
  plugins: []
};
