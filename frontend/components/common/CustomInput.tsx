import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextStyle,
  TouchableWithoutFeedback,
  KeyboardTypeOptions,
  ViewStyle,
} from "react-native";

interface CustomInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isFocused || value !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const labelStyle: Animated.AnimatedProps<TextStyle> = {
    position: "absolute",
    left: 11,
    zIndex: 10,
    paddingTop: 2,
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: "#777777",
  };

  const onPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.inputView, isFocused && styles.inputFocused, style]}>
        <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
        <TextInput
          ref={inputRef}
          secureTextEntry={secureTextEntry}
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: "100%",
    marginBottom: 16,
    borderColor: "#D1D1D1",
    borderWidth: 0.5,
    borderRadius: 10,
    position: "relative",
  },
  inputFocused: {
    borderColor: "#1E201E",
    borderWidth: 1,
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingTop: 15,
    paddingBottom: 0,
    fontSize: 14,
    color: "#000",
  },
});

export default CustomInput;
