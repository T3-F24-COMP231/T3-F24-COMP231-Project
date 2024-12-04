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
  CustomHeader,
  CustomListEmpty,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { IExpense } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";
import Checkbox from "expo-checkbox";

export default function ExpensesScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentExpense, setCurrentExpense] = useState<IExpense | null>(null);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        const data = await apiRequest(
          `/users/${currentUser._id}/expenses`,
          "GET",
          undefined,
          token
        );
        setExpenses(data || []);
        setFilteredExpenses(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredExpenses(expenses);
    } else {
      const filteredData = expenses.filter(
        (expense) =>
          expense.title.toLowerCase().includes(query.toLowerCase()) ||
          expense.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExpenses(filteredData);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelectExpense = (id: string, isChecked: boolean) => {
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
          `/users/${currentUser?._id}/expense/${id}`,
          "DELETE",
          undefined,
          token
        );
      }

      Alert.alert("Success", "Selected expenses deleted successfully.");
      setExpenses(expenses.filter((expense) => !selectedIds.includes(expense._id)));
      setFilteredExpenses(
        filteredExpenses.filter((expense) => !selectedIds.includes(expense._id))
      );
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete selected expenses.");
    }
  };

  const handleUpdateExpense = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !currentExpense) return;

      await apiRequest(
        `/users/${currentUser?._id}/expense/${currentExpense._id}`,
        "PUT",
        { title, amount: parseFloat(amount), description, category },
        token
      );

      Alert.alert("Success", "Expense updated successfully.");
      setExpenses(
        expenses.map((expense) =>
          expense._id === currentExpense._id
            ? { ...expense, title, amount: parseFloat(amount), description, category }
            : expense
        )
      );
      setFilteredExpenses(
        filteredExpenses.map((expense) =>
          expense._id === currentExpense._id
            ? { ...expense, title, amount: parseFloat(amount), description, category }
            : expense
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update expense.");
    }
  };

  const openModal = (expense: IExpense) => {
    setCurrentExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setCategory(expense.category);
    setIsModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.red} />;
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="All Expenses" />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={toggleSelectionMode} style={styles.selectButton}>
          <Text style={[styles.selectButtonText, { color: theme.purple }]}>
            Select
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <CustomView style={[styles.item, { backgroundColor: theme.lightGray }]}>
              {isSelectionMode && (
                <Checkbox
                  value={selectedIds.includes(item._id)}
                  onValueChange={(isChecked) =>
                    handleSelectExpense(item._id, isChecked)
                  }
                  color={theme.purple}
                />
              )}
              <View style={styles.itemContent}>
                <CustomText style={styles.title}>{item.title}</CustomText>
                <CustomText>Amount: ${item.amount}</CustomText>
                <CustomText>Category: {item.category}</CustomText>
                <CustomText>Description: {item.description}</CustomText>
                <CustomText style={styles.timestamp}>
                  Time:{" "}
                  {new Date(item.date).toLocaleDateString() +
                    " " +
                    new Date(item.date).toLocaleTimeString()}
                </CustomText>
              </View>
            </CustomView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <CustomListEmpty
            message="No Expenses Found"
            onRetry={() => fetchExpenses()}
          />
        }
      />

      {isSelectionMode && (
        <CustomButton text="Delete Selected" onPress={handleDeleteSelected} />
      )}

      {/* Update Modal */}
      {currentExpense && (
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Update Expense"
        >
          <CustomInput placeholder="Title" value={title} onChangeText={setTitle} />
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
          <CustomInput
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <CustomButton text="Update Expense" onPress={handleUpdateExpense} />
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
    marginVertical: 20,
    height: 50,
  },
  searchBar: {
    width: "75%",
    height: "100%",
  },
  selectButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    marginBottom: 16,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
