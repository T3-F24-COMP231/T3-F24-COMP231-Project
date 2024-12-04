import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../common";
import useTheme from "../../hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  back?: boolean;
  onBackPress?: () => void;
  rightItems?: React.ReactNode[];
}

const CustomHeader: React.FC<HeaderProps> = ({
  title,
  back,
  onBackPress,
  rightItems = [],
}) => {
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
      {back && (
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
      )}
      {/* Title */}
      <CustomText style={[styles.title, { color: theme.text }]}>
        {title}
      </CustomText>

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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: StatusBar.currentHeight || 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightItem: {
    marginLeft: 10,
  },
});
