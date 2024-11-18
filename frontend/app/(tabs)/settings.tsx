import React from "react";
import { StyleSheet, View, Switch, Appearance, Image } from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomHeader,
  CustomText,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const { theme, toggleMode, isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <CustomBackground>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* Header with caret left icon */}
        <CustomHeader title="Settings" />
        <View style={{ height: "80%" }}>
          <View
            style={styles.avatarWrapper}
          >
            <Image
              source={require("../../assets/images/background-1.jpg")}
              alt="Profile Image"
              style={styles.avatar}
            />
            <CustomText style={styles.title}>{currentUser?.name}</CustomText>
          </View>
          <View style={styles.section}>
            <View>
              <CustomText style={[styles.sectionTitle, { color: theme.text }]}>
                Appearance
              </CustomText>
              <CustomText
                style={[styles.sectionDescription, { color: theme.text }]}
              >
                {isDarkMode ? "Dark mode is on" : "Light mode is on"}
              </CustomText>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={toggleMode}
              thumbColor={isDarkMode ? "#4a5dff" : "#f0f0f0"}
              trackColor={{ false: "#4a5dff", true: "#fff" }}
            />
          </View>
        </View>
        {/* Appearance Section */}

        {/* Logout Button */}
        <CustomButton
          text="Sign Out"
          onPress={handleLogout}
          buttonStyle={[styles.logoutButton, { backgroundColor: "#ff3b30" }]}
          textStyle={styles.logoutText}
        />
      </View>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 30,
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginLeft: 10,
  },
  section: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
