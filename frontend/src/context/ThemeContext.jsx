import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ai-architect-theme";
const VALID_THEMES = ["colorful", "light", "dark"];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_THEMES.includes(saved)) {
        return saved;
      }
    } catch {
      // localStorage error fallback
    }
    return "colorful"; // Default theme
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.error("Theme storage error:", e);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: VALID_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
