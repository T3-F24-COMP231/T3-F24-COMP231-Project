import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { apiRequest, getToken, resolveRoute } from "@/utils";
import { useTheme } from "@/hooks";
import { CustomText } from "../common";

interface NotificationCardProps {
  notification: {
    _id: string;
    message: string;
    userId?: string;
    type: string;
    metadata?: Record<string, any>;
    status: "unread" | "read";
    createdAt: string;
  };
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    const token = await getToken();
    try {
      // Mark notification as read
      await apiRequest(
        `/users/${notification.userId}/notifications/${notification._id}/mark-read`,
        "PUT",
        notification,
        token
      );

      const route = resolveRoute(notification.type, notification.metadata);
      if (route) {
        router.push(route as any);
      } else {
        console.warn(
          "Route resolution failed for notification type:",
          notification.type
        );
      }
    } catch (error) {
      console.error("Failed to handle notification click:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <ActivityIndicator size="small" color={theme.purple} />;
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor:
            notification.status === "unread" ? "#182747" : theme.background,
          borderColor: theme.border,
        },
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <View>
        <CustomText style={styles.message}>{notification.message}</CustomText>
        <Text style={styles.timestamp}>
          {new Date(notification.createdAt).toLocaleString()}
        </Text>
      </View>
      {notification.status === "unread" && (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 100,
            backgroundColor: theme.purple,
          }}
        ></View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.2,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});

export default NotificationCard;
