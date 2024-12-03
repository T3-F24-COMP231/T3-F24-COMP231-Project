import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  CustomBackground,
  CustomText,
  CustomHeader,
  CustomListEmpty,
} from "@/components";
import { useTheme } from "@/hooks";
import { apiRequest, getToken } from "@/utils";
import { IActivity } from "@/types";
import { BASE_URL } from "@/api";

const ViewActivitiesScreen = () => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        Alert.alert("Error", "Unauthorized access. Please log in.");
        return;
      }
      const response = await apiRequest(`/activities`, "GET", undefined, token);
      if (response) {
        setActivities(response);
      } else {
        setActivities([]);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const renderActivityItem = (activity: IActivity) => (
    <View
      key={activity._id}
      style={[
        styles.activityItem,
        { backgroundColor: theme.lightGray, borderColor: theme.border },
      ]}
    >
      <CustomText style={[styles.activityTitle]}>
        Event: {activity.event || "Unknown Event"}
      </CustomText>
      <CustomText style={styles.activityDetails}>
        Description: {activity.description}
      </CustomText>
      <CustomText style={styles.activityDetails}>
        Date:{" "}
        {new Date(activity.timestamp).toLocaleDateString() +
          " " +
          new Date(activity.timestamp).toLocaleTimeString()}
      </CustomText>
      <CustomText style={styles.activityDetails}>
        Action By: {activity.actionBy || "N/A"}
      </CustomText>
      {activity.metaData && (
        <View style={styles.metaDataContainer}>
          <CustomText style={styles.metaDataTitle}>MetaData:</CustomText>
          {Object.entries(activity.metaData).map(([key, value]) => (
            <CustomText key={key} style={styles.metaDataDetails}>
              {key}: {JSON.stringify(value, null, 2)}
            </CustomText>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <CustomBackground style={{ flex: 1 }}>
      <CustomHeader back title="View Activities" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.purple} />
        ) : activities.length === 0 ? (
          <CustomListEmpty
            message="No activities found."
            onRetry={fetchActivities}
          />
        ) : (
          activities.map(renderActivityItem)
        )}
      </ScrollView>
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    minWidth: "100%",
    paddingBottom: 50,
  },
  activityItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  noActivitiesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  metaDataContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    width: "100%",
  },
  metaDataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  metaDataDetails: {
    fontSize: 12,
    color: "#555",
    marginBottom: 3,
  },
});

export default ViewActivitiesScreen;
