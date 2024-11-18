import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { getGlobalStyles } from "@/styles";
import useTheme from "../../hooks/useThemeColor";

interface CustomViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const CustomView: React.FC<CustomViewProps> = ({
  style,
  children,
  ...props
}) => {
  const globalStyles = getGlobalStyles();
  const { theme } = useTheme();
  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.background },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default CustomView;
