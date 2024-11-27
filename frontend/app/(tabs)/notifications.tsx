import { StyleSheet } from "react-native";
import React from "react";
import { CustomBackground, CustomHeader, NotificationList } from "@/components";
import { useAuth } from "@/hooks";

export default function Notifications() {
  const { currentUser } = useAuth();
  return (
    <CustomBackground>
      <CustomHeader title="Notifications" />
      <NotificationList userId={currentUser?._id} />
    </CustomBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
