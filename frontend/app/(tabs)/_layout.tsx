import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import useTheme from "@/hooks/useThemeColor";

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
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
        name="add"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="add-outline" color={color} size={24} />
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
