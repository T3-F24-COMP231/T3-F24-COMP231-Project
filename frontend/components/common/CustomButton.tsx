import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import CustomText from "./CustomText";
import useTheme from "../../hooks/useThemeColor";

interface CustomButtonProps {
  text: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  backgroundColor?: string;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  backgroundColor,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor || "#4A5DFF",
        },
        buttonStyle,
        style,
      ]}
    >
      <CustomText style={[styles.text, textStyle]}>{text}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "95%",
    paddingVertical: 12,
    marginHorizontal: "auto",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CustomButton;
