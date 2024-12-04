import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import {
  CustomBackground,
  CustomHeader,
  CustomText,
  CustomInput,
  CustomButton,
  CustomModal,
} from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";
import { IRole, IUser } from "@/types";
import { useTheme } from "@/hooks";

export default function AdminRolesScreen() {
  const { theme } = useTheme();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const fetchRolesAndUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const [rolesData, usersData] = await Promise.all([
        apiRequest("/roles", "GET", undefined, token),
        apiRequest("/users", "GET", undefined, token),
      ]);

      setRoles(rolesData || []);
      setUsers(usersData || []);
      setFilteredUsers(usersData || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch roles or users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAssignRole = async () => {
    try {
      if (!selectedUser || !selectedRole) return;
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      await apiRequest(
        `/users/${selectedUser._id}/upgrade-role`,
        "POST",
        { newRole: selectedRole },
        token
      );

      Alert.alert("Success", "Role assigned successfully");
      setModalVisible(false);
      fetchRolesAndUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to assign role");
    }
  };

  const openModal = (user: IUser) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4A5DFF" />
      </CustomBackground>
    );
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="Roles & Permissions" />

      {/* Search Input */}
      <CustomInput
        placeholder="Search users by name or role..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => openModal(item)}
          >
            <Text style={{fontSize: 20, fontWeight: "medium", color:"#fff"}}>{item.name}</Text>
            <Text style={{color: theme.purple}}>
              Role: {item.role || "Finance Tracker"}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <CustomText style={styles.emptyMessage}>
            No users found matching your search.
          </CustomText>
        }
      />

      {/* Assign Role Modal */}
      {selectedUser && (
        <CustomModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={`Assign Role to ${selectedUser.name}`}
        >
          <CustomText style={styles.selectRoleText}>Select a role:</CustomText>
          <FlatList
            data={roles}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
            bounces={true}
            renderItem={({ item }) => (
              <View style={styles.renderedItem}>
                <TouchableOpacity
                  onPress={() => setSelectedRole(item.name)}
                  style={[
                    styles.roleOption,
                    selectedRole === item.name && styles.selectedRoleOption,
                  ]}
                >
                  <CustomText>{item.name}</CustomText>
                </TouchableOpacity>
              </View>
            )}
          />
          <CustomButton text="Assign Role" onPress={handleAssignRole} />
        </CustomModal>
      )}
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 70,
  },
  searchInput: {
    marginBottom: 20,
  },
  userContainer: {
    padding: 15,
    rowGap: 8,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#393E46",
  },
  selectRoleText: {
    width: "100%",
    marginBottom: 20,
    textAlign: "left",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
  },
  renderedItem: {
    minWidth: "100%",
    marginBottom: 15,
  },
  roleOption: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedRoleOption: {
    backgroundColor: "#4A5DFF",
  },
});
