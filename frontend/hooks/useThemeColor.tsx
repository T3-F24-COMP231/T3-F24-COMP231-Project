import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Theme } from "../types";
import { Colors } from "../components/constants";

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleMode: () => void;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ColorSchemeName>(
    Appearance.getColorScheme() || "light"
  );

  // Determine if the current mode is dark
  const isDarkMode = mode === "dark";

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme || "light");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Get the current theme colors based on the mode
  const currentTheme = Colors[mode as keyof typeof Colors];

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to access the theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;
