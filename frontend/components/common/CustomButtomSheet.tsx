import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import CustomText from "./CustomText";
import { router } from "expo-router";
import { getGlobalStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

interface CustomBottomSheetProps {
  title: string;
  children: React.ReactNode;
}
const {width: WIDTH} = Dimensions.get("screen")
export default function CustomBottomSheet({
  title,
  children,
}: CustomBottomSheetProps) {
  const {theme} = useTheme();
  const globalStyles = getGlobalStyles();
  return (
    <View style={styles.overlay}>
      <View style={[styles.bottomSheetStyle, {borderWidth: 0.5, borderColor: "#fff"}]}>
        <View style={[styles.headerContainer, globalStyles.centeredContainer]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={24} color={theme.text}/>
          </TouchableOpacity>
          <CustomText>{title}</CustomText>
        </View>
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: WIDTH,
  },
  bottomSheetStyle: {
    width: "100%",
    height: "auto",
    shadowColor: "#000",
    rowGap: 40,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  contentContainer: {
    width: "100%",
    flexGrow: 1,
  },

  backButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
});