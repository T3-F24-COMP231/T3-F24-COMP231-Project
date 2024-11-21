import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../common";
import useTheme from "../../hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightItems?: React.ReactNode[];
}

const CustomHeader: React.FC<HeaderProps> = ({ title, onBackPress, rightItems = [] }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>

      {/* Title */}
      <CustomText style={[styles.title, { color: theme.text }]}>{title}</CustomText>

      {/* Right Items */}
      <View style={styles.rightContainer}>
        {rightItems.map((item, index) => (
          <View key={index} style={styles.rightItem}>
            {item}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  backButton: {
    padding: 5,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightItem: {
    marginLeft: 12,
  },
});
