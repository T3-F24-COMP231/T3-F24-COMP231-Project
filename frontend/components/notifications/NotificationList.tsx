import React, { useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import NotificationCard from "./NotificationCard";
import { apiRequest, getToken } from "@/utils";
import { useTheme } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomListEmpty } from "../common";

const NotificationList = ({ userId }: { userId: string | undefined }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      const data = await apiRequest(
        `/users/${userId}/notifications`,
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
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.purple} />;
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <NotificationCard notification={item} />}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchNotifications} />
      }
      ListEmptyComponent={
        <CustomListEmpty
          message="No notifications found"
          onRetry={() => fetchNotifications()}
        />
      }
    />
  );
};

export default NotificationList;
