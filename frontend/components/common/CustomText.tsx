import React from "react";
import { Text, TextProps } from "react-native";
import useTheme from "../../hooks/useThemeColor";
import { getGlobalStyles } from "@/styles";

interface CustomTextProps extends TextProps {
  style?: {};
}

const CustomText: React.FC<CustomTextProps> = ({ style, ...props }) => {
  const globalStyles = getGlobalStyles();
  const { theme } = useTheme();

  return (
    <Text
      style={[globalStyles.textMedium, { color: theme.text }, style]}
      {...props}
    />
  );
};

export default CustomText;
