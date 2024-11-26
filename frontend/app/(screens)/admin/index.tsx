import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
import { apiRequest, hasPermission } from "@/utils";
import { useAuth } from "@/hooks";

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role | null;
}

export default function AdminRolesScreen() {
  const { currentUser } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const fetchRolesAndUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const [usersData] = await Promise.all([
        // apiRequest("/roles", "GET", undefined, token),
        apiRequest("/users", "GET", undefined, token),
      ]);

    //   setRoles(rolesData || []);
      setUsers(usersData || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch roles or users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndUsers();
  }, []);

  const handleCreateRole = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await apiRequest("/roles", "POST", { name: newRoleName }, token);
      Alert.alert("Success", "Role created successfully");
      setNewRoleName("");
      fetchRolesAndUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to create role");
    }
  };

  const handleAssignRole = async () => {
    try {
      if (!selectedUser || !selectedRoleId) return;
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await apiRequest(
        `/users/${selectedUser._id}/role`,
        "PUT",
        { roleId: selectedRoleId },
        token
      );

      Alert.alert("Success", "Role assigned successfully");
      setModalVisible(false);
      fetchRolesAndUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to assign role");
    }
  };

  const openModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role?._id || "");
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

      {/* Create Role */}
      <View style={styles.createRoleContainer}>
        <CustomInput
          placeholder="Enter Role Name"
          value={newRoleName}
          onChangeText={setNewRoleName}
          style={styles.input}
        />
        <CustomButton text="Create Role" onPress={handleCreateRole} />
      </View>

      {/* Users List */}
      <CustomText style={styles.sectionTitle}>Users</CustomText>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => openModal(item)}
          >
            <CustomText>{item.name}</CustomText>
            <CustomText style={styles.roleText}>
              Role: {item.role?.name || "Unassigned"}
            </CustomText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <CustomText style={styles.emptyMessage}>No users found</CustomText>
        }
      />

      {/* Assign Role Modal */}
      {selectedUser && (
        <CustomModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Assign Role"
        >
          <CustomText>Select a role for {selectedUser.name}</CustomText>
          <FlatList
            data={roles}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedRoleId(item._id)}
                style={[
                  styles.roleOption,
                  selectedRoleId === item._id && styles.selectedRoleOption,
                ]}
              >
                <CustomText>{item.name}</CustomText>
              </TouchableOpacity>
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
  createRoleContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#393E46",
  },
  roleText: {
    color: "#4A5DFF",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
  },
  roleOption: {
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
