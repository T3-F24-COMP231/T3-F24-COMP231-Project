import React from "react";
import {
  StyleSheet,
  View,
  Switch,
  Appearance,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomHeader,
  CustomText,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { hasPermission } from "@/utils";

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
      {/* Header with caret left icon */}
      <CustomHeader title="Settings" />
      <View style={styles.settingsContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../assets/images/background-1.jpg")}
            alt="Profile Image"
            style={styles.avatar}
          />
          <CustomText
            style={styles.title}
          >{`${currentUser?.name} - ${currentUser?.role}`}</CustomText>
        </View>
        <View style={styles.section}>
          {currentUser && hasPermission(currentUser, "view:users") && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(screens)/admin")}
            >
              <CustomText>Manage Users and Roles</CustomText>
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
          {currentUser && hasPermission(currentUser, "view:logs") && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(screens)/admin/ViewActivitiesScreen")}
            >
              <CustomText>View Activity Logs</CustomText>
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
      </View>
      {/* Appearance Section */}

      {/* Logout Button */}
      <CustomButton
        text="Sign Out"
        onPress={handleLogout}
        buttonStyle={[styles.logoutButton, { backgroundColor: "#ff3b30" }]}
        textStyle={styles.logoutText}
      />
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
  settingsContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
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
    justifyContent: "space-between",
    paddingVertical: 10,
    rowGap: 20,
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
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
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
