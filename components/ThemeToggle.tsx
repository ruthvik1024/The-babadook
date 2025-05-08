import React from "react";

function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  return (
    <button
      className="rounded-full p-2 bg-zinc-700 text-white hover:bg-zinc-600 transition"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark/light mode"
      title="Toggle dark/light mode"
    >
      {theme === "dark" ? (
        <span role="img" aria-label="Light mode">
          🌞
        </span>
      ) : (
        <span role="img" aria-label="Dark mode">
          🌚
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
