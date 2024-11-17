import React from "react";
import { StyleSheet } from "react-native";
import { CustomButton, CustomText, CustomView } from "@/components";
import { useAuth } from "@/hooks";
import { router } from "expo-router";

export default function Settings() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <CustomView style={styles.container}>
      <CustomText style={styles.title}>Settings</CustomText>
      <CustomButton
        text="Sign Out"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        textStyle={styles.logoutText}
      />
    </CustomView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff",
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "#ff3b30",
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
