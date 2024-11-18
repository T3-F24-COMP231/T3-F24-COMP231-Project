import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ViewProps,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { useTheme } from "@/hooks";

interface CustomBackgroundProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const CustomBackground: React.FC<CustomBackgroundProps> = ({
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }, style]}
      {...rest}
    >
      <View
        style={{ backgroundColor: theme.background, paddingHorizontal: 10 }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default CustomBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});
