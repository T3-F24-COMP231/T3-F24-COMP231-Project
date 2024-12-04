import { StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CustomBackground,
  CustomButton,
  CustomHeader,
  NotificationList,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { apiRequest, getToken } from "@/utils";

export default function Notifications() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      const data = await apiRequest(
        `/users/${currentUser?._id}/notifications`,
        "GET",
        undefined,
        token
      );
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (!currentUser?._id) {
        throw new Error("User is not authenticated");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      await apiRequest(
        `/users/${currentUser._id}/notifications/mark-all-read`,
        "POST",
        undefined,
        token
      );
      fetchNotifications();
      Alert.alert("Success", "All notifications marked as read!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      Alert.alert(
        "Error",
        `Failed to mark notifications as read: ${errorMessage}`
      );
    }
  };

  return (
    <CustomBackground>
      <CustomHeader
      back
        title="Notifications"
        rightItems={[
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={{ color: theme.purple }}>Mark All as Read</Text>
          </TouchableOpacity>,
        ]}
      />
      <NotificationList
        loading={loading}
        userId={currentUser?._id}
        fetchNotifications={fetchNotifications}
        notifications={notifications}
      />
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  markAllButton: {
    marginVertical: 20,
    alignSelf: "center",
    width: "auto",
    position: "absolute",
    right: 10,
    top: -25,
  },
});
