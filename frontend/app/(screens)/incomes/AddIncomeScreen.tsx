import React, { useState } from "react";
import { StyleSheet, Alert, View, ScrollView } from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomHeader,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { addIncome, getToken } from "@/utils";
import { useAuth } from "@/hooks";
import { router } from "expo-router";

export default function AddIncomeScreen() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
  };

  const handleAddIncome = async () => {
    try {
      const token = await getToken();
      if (currentUser?._id && token) {
        await addIncome(
          currentUser._id,
          { title, amount: parseFloat(amount), description },
          token
        );

        // Alert with options
        Alert.alert(
          "Success",
          "Income added successfully!",
          [
            {
              text: "Add a new Income",
              onPress: resetForm,
            },
            {
              text: "View Incomes",
              onPress: () => router.replace("/(screens)/incomes"),
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", `Failed to add income: ${errorMessage}`);
    }
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <CustomHeader back title="Add New Income" />
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
            <CustomButton
              text="Submit Income"
              onPress={handleAddIncome}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </CustomBackground>
    </KeyboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    marginTop: 20,
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
  button: {
    width: "100%",
    marginTop: 20,
  },
});
