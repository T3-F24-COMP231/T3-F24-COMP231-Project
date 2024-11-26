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
import { IIncome } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";
import Checkbox from "expo-checkbox";

export default function IncomesScreen() {
  const { currentUser } = useAuth();
  const [incomes, setIncomes] = useState<IIncome[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<IIncome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentIncome, setCurrentIncome] = useState<IIncome | null>(null);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (currentUser?._id && token) {
          const data = await apiRequest(
            `/users/${currentUser._id}/incomes`,
            "GET",
            undefined,
            token
          );
          setIncomes(data || []);
          setFilteredIncomes(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch incomes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredIncomes(incomes);
    } else {
      const filteredData = incomes.filter(
        (income) =>
          income.title.toLowerCase().includes(query.toLowerCase()) ||
          income.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredIncomes(filteredData);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelectIncome = (id: string, isChecked: boolean) => {
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
          `/users/${currentUser?._id}/income/${id}`,
          "DELETE",
          undefined,
          token
        );
      }

      Alert.alert("Success", "Selected incomes deleted successfully.");
      setIncomes(incomes.filter((income) => !selectedIds.includes(income._id)));
      setFilteredIncomes(
        filteredIncomes.filter((income) => !selectedIds.includes(income._id))
      );
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete selected incomes.");
    }
  };

  const handleUpdateIncome = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !currentIncome) return;

      await apiRequest(
        `/users/${currentUser?._id}/income/${currentIncome._id}`,
        "PUT",
        { title, amount: parseFloat(amount), description },
        token
      );

      Alert.alert("Success", "Income updated successfully.");
      setIncomes(
        incomes.map((income) =>
          income._id === currentIncome._id
            ? { ...income, title, amount: parseFloat(amount), description }
            : income
        )
      );
      setFilteredIncomes(
        filteredIncomes.map((income) =>
          income._id === currentIncome._id
            ? { ...income, title, amount: parseFloat(amount), description }
            : income
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update income.");
    }
  };

  const openModal = (income: IIncome) => {
    setCurrentIncome(income);
    setTitle(income.title);
    setAmount(income.amount.toString());
    setDescription(income.description);
    setIsModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4a5dff" />;
  }

  return (
    <CustomBackground style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search incomes..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={toggleSelectionMode} style={styles.selectButton}>
          <Text style={[styles.selectButtonText, {color: "#4A5DFF"}]}>Select</Text>
        </TouchableOpacity>
      </View>

      {/* Incomes List */}
      <FlatList
        data={filteredIncomes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <CustomView style={styles.item}>
              {isSelectionMode && (
                <Checkbox
                  value={selectedIds.includes(item._id)}
                  onValueChange={(isChecked) =>
                    handleSelectIncome(item._id, isChecked)
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
        ListEmptyComponent={<CustomText>No incomes found.</CustomText>}
      />

      {isSelectionMode && (
        <CustomButton text="Delete Selected" onPress={handleDeleteSelected} />
      )}

      {/* Update Modal */}
      {currentIncome && (
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Update Income"
        >
          <CustomInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <CustomInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <CustomInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <CustomButton text="Update Income" onPress={handleUpdateIncome} />
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
    backgroundColor: "#2d3436",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
