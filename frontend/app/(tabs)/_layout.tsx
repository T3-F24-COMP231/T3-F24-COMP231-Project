import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import useTheme from "@/hooks/useThemeColor";

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4A5DFF",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="menu" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="notifications-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="settings-outline" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
