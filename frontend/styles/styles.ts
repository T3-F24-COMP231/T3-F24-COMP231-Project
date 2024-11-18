import { StyleSheet } from "react-native";
import { FontSizes } from "./fontSize";
import { Spacing } from "./spacing";
import { Colors } from "@/components";

/*  For future reference, if we need to make the elements confirm to the device appearance, pass "theme" 
    to this method as parameter and pass the "theme" from the hook to it as argument in the component(functional)
    where it's meant to be used.
 */

const baseTextStyle = {
  fontFamily: "SansRegular",
  color: Colors?.light.text,
};

export const getGlobalStyles = () =>
  StyleSheet.create({
    text: {
      ...baseTextStyle,
    },
    textSmall: {
      fontSize: FontSizes.small,
      ...baseTextStyle,
    },
    textMedium: {
      fontSize: FontSizes.medium,
      ...baseTextStyle,
    },
    textLarge: {
      fontSize: FontSizes.large,
      ...baseTextStyle,
    },
    textXLarge: {
      fontSize: FontSizes.xLarge,
      ...baseTextStyle,
    },
    fontMedium: {
      fontFamily: "SansSemiBold",
    },
    fontBold: {
      fontFamily: "SansBold",
    },
    title: {
      ...baseTextStyle,
      fontSize: FontSizes.xLarge,
      fontWeight: "500",
      color: Colors.light.text,
    },
    container: {
      flex: 1,
      paddingHorizontal: 8,
      paddingVertical: 10,
      backgroundColor: Colors.light.background,
    },
    startContainer: {
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "center",
      rowGap: 20,
    },
    centeredContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      rowGap: 20,
    },
    wrapper: {
      marginVertical: Spacing.lg,
    },
    button: {
      backgroundColor: Colors.light.blue,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: Colors.light.blue,
      fontSize: 18,
      fontFamily: "SansSemiBold",
    },
  });
