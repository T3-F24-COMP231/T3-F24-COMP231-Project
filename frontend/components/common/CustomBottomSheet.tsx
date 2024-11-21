import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import CustomText from "./CustomText";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

interface CustomBottomSheetProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomBottomSheet = ({
  title,
  children,
  style,
}: CustomBottomSheetProps) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <View style={[styles.bottomSheetStyle, style, {borderColor: isDarkMode ? "#fff" : ""}]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <CustomText style={[styles.title, { color: theme.text }]}>
            {title}
          </CustomText>
        </View>
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetStyle: {
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    borderWidth: 0.5,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
});

export default CustomBottomSheet;
