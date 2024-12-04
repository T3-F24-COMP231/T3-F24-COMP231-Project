import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import NotificationCard from "./NotificationCard";
import { useTheme } from "@/hooks";
import { CustomListEmpty } from "../common";

const NotificationList = ({ loading, userId, fetchNotifications, notifications }:any) => {
  const { theme } = useTheme();
  
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
