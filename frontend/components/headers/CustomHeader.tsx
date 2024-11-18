import React from "react";
import { View, StyleSheet} from "react-native";
import { CustomText } from "../common";
import useTheme from "../../hooks/useThemeColor";

interface HeaderProps {
  title: string;
  rightItems?: React.ReactNode[];
}

const CustomHeader: React.FC<HeaderProps> = ({ title, rightItems = [] }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomText style={styles.title}>{title}</CustomText>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 60,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightItem: {
    marginLeft: 12, // Spacing between right-side items
  },
});

export default CustomHeader;
