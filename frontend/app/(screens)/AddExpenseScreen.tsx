import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { CustomBackground, CustomButton, CustomInput, CustomText } from "@/components";
import { addExpense } from "@/utils";
import { useAuth } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddExpenseScreen() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddExpense = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        await addExpense(
          currentUser._id,
          { title, amount: parseFloat(amount), description },
          token
        );
        Alert.alert("Success", "Expense added successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", `Failed to add expense: ${errorMessage}`);
    }
  };

  return (
    <CustomBackground style={styles.container}>
      <CustomText style={styles.title}>Add New Expense</CustomText>
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
      <CustomButton text="Submit Expense" onPress={handleAddExpense} style={styles.button} />
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4a5dff",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});
