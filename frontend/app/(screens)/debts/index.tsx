import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Alert,
  Text,
} from "react-native";
import {
  CustomBackground,
  CustomText,
  CustomView,
  CustomInput,
  CustomButton,
  CustomModal,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { IDebt } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";
import Checkbox from "expo-checkbox";

export default function DebtsScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState<IDebt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<IDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentDebt, setCurrentDebt] = useState<IDebt | null>(null);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (currentUser?._id && token) {
          const data = await apiRequest(
            `/users/${currentUser._id}/debts`,
            "GET",
            undefined,
            token
          );
          setDebts(data || []);
          setFilteredDebts(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch debts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredDebts(debts);
    } else {
      const filteredData = debts.filter(
        (debt) =>
          debt.title.toLowerCase().includes(query.toLowerCase()) ||
          debt.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDebts(filteredData);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelectDebt = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      for (const id of selectedIds) {
        await apiRequest(
          `/users/${currentUser?._id}/debt/${id}`,
          "DELETE",
          undefined,
          token
        );
      }

      Alert.alert("Success", "Selected debts deleted successfully.");
      setDebts(debts.filter((debt) => !selectedIds.includes(debt._id)));
      setFilteredDebts(
        filteredDebts.filter((debt) => !selectedIds.includes(debt._id))
      );
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete selected debts.");
    }
  };

  const handleUpdateDebt = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !currentDebt) return;

      await apiRequest(
        `/users/${currentUser?._id}/debt/${currentDebt._id}`,
        "PUT",
        { title, amount: parseFloat(amount), description },
        token
      );

      Alert.alert("Success", "Debt updated successfully.");
      setDebts(
        debts.map((debt) =>
          debt._id === currentDebt._id
            ? { ...debt, title, amount: parseFloat(amount), description }
            : debt
        )
      );
      setFilteredDebts(
        filteredDebts.map((debt) =>
          debt._id === currentDebt._id
            ? { ...debt, title, amount: parseFloat(amount), description }
            : debt
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update debt.");
    }
  };

  const openModal = (debt: IDebt) => {
    setCurrentDebt(debt);
    setTitle(debt.title);
    setAmount(debt.amount.toString());
    setDescription(debt.description);
    setIsModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff6347" />;
  }

  return (
    <CustomBackground style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search debts..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={toggleSelectionMode} style={styles.selectButton}>
          <Text style={[styles.selectButtonText, {color: "#4A5DFF"}]}>Select</Text>
        </TouchableOpacity>
      </View>

      {/* Debts List */}
      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <CustomView style={styles.item}>
              {isSelectionMode && (
                <Checkbox
                  value={selectedIds.includes(item._id)}
                  onValueChange={(isChecked) =>
                    handleSelectDebt(item._id, isChecked)
                  }
                  color="#4A5DFF"
                />
              )}
              <View style={{ marginLeft: 20 }}>
                <CustomText style={styles.title}>{item.title}</CustomText>
                <CustomText>Amount: ${item.amount}</CustomText>
                <CustomText>Description: {item.description}</CustomText>
              </View>
            </CustomView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<CustomText>No debts found.</CustomText>}
      />

      {isSelectionMode && (
        <CustomButton text="Delete Selected" onPress={handleDeleteSelected} />
      )}

      {/* Update Modal */}
      {currentDebt && (
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Update Debt"
        >
          <CustomInput placeholder="Title" value={title} onChangeText={setTitle} />
          <CustomInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <CustomInput placeholder="Description" value={description} onChangeText={setDescription} />
          <CustomButton text="Update Debt" onPress={handleUpdateDebt} />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 40,
    height: 50,
  },
  searchBar: {
    width: "75%",
    height: "100%",
    alignItems: "center",
  },
  selectButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  selectButtonText: {
    fontSize: 18,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#ff6347",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
