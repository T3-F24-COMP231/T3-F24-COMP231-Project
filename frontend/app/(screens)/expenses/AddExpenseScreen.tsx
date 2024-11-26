import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Text,
  View,
} from "react-native";
import {
  CustomBackground,
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomModal,
  CustomText,
  CustomView,
  KeyboardLayout,
} from "@/components";
import { addExpense, apiRequest } from "@/utils";
import { useAuth } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AddExpenseScreen() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      router.replace("/(auth)/login");
    }
  }, [currentUser]);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const data = await apiRequest(
        `/users/${currentUser?._id}/categories`,
        "GET",
        undefined,
        token
      );

      setCategories(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch categories.");
      console.error("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new expense
  const handleAddExpense = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!currentUser?._id || !token) return;

      await addExpense(
        currentUser._id,
        {
          title,
          amount: parseFloat(amount),
          description,
          category: selectedCategory,
        },
        token
      );

      Alert.alert(
        "Success",
        "Expense added successfully!",
        [
          {
            text: "Add a new Expense",
            onPress: resetForm,
          },
          {
            text: "Go home",
            onPress: () => router.replace("/(tabs)"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", `Failed to add expense: ${errorMessage}`);
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setSelectedCategory("");
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomBottomSheet title="Add New Expense">
          <View style={styles.content}>
            <CustomInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <CustomInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <CustomInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

            {/* Category Selection */}
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setShowCategoryModal(true)}
            >
              <CustomText
                style={{ fontSize: 14, color: "#000", fontWeight: "500" }}
              >
                {selectedCategory || "Select a Category"}
              </CustomText>
            </TouchableOpacity>

            <CustomButton
              text="Submit Expense"
              onPress={handleAddExpense}
              style={styles.button}
            />
          </View>
        </CustomBottomSheet>
        {/* <CustomText style={styles.title}>Add New Expense</CustomText> */}

        {/* Category Modal */}
        <CustomModal
          title="Select a Category"
          isVisible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
        >
          <CustomBackground style={styles.modalContainer}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <CustomView>
                  <Text style={{ color: "red" }}>No category to display</Text>
                </CustomView>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item.name)}
                >
                  <CustomText>{item.name}</CustomText>
                </TouchableOpacity>
              )}
            />
          </CustomBackground>
        </CustomModal>
      </CustomBackground>
    </KeyboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  categoryButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
