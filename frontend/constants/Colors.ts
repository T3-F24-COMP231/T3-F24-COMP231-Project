/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { ThemeType } from "@/types";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#0a7ea4";

export const Colors: ThemeType = {
  light: {
    text: "#2C2C2E",
    blue: "#3B46F1",
    green: "#7FFA88",
    red: "#FF2424",
    white: "#FFF",
    border: "#2C2C2E",
    purple: "#4A5DFF",
    darkGray: "",
    lightGray: "",
    background: "#F5F7F8",
    tabIconDefault: tintColorLight,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F5F7F8",
    blue: "#3B46F1",
    green: "#7FFA88",
    red: "#FF2424",
    white: "#FFF",
    border: "#F5F7F8",
    purple: "#4A5DFF",
    darkGray: "",
    lightGray: "",
    background: "#0a0e27",
    tabIconDefault: tintColorDark,
    tabIconSelected: tintColorDark,
  },
};