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

  const currentTheme = Colors[mode as keyof typeof Colors];

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
export default useTheme;
