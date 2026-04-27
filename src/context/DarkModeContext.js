import React, { createContext, useState, useEffect, useContext } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  // Function to detect system theme
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Apply theme
  useEffect(() => {
    const root = document.body;

    const appliedTheme = theme === "system" ? getSystemTheme() : theme;

    root.classList.remove("light-mode", "dark-mode");
    root.classList.add(`${appliedTheme}-mode`);

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system changes (only when in system mode)
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const root = document.body;
        const systemTheme = media.matches ? "dark" : "light";

        root.classList.remove("light-mode", "dark-mode");
        root.classList.add(`${systemTheme}-mode`);
      }
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <DarkModeContext.Provider value={{ theme, setTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);