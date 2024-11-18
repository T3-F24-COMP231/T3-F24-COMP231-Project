import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { addDebt } from "@/utils";
import { useAuth } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AddDebtScreen() {
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

  const handleAddDebt = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        await addDebt(
          currentUser._id,
          { title, amount: parseFloat(amount), description },
          token
        );

        Alert.alert(
          "Success",
          "Debt added successfully!",
          [
            {
              text: "Add a new Debt",
              onPress: resetForm,
            },
            {
              text: "Go home",
              onPress: () => {
                resetForm();
                router.replace("/(tabs)");
              },
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", `Failed to add debt: ${errorMessage}`);
    }
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomText style={styles.title}>Add New Debt</CustomText>
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
          text="Submit Debt"
          onPress={handleAddDebt}
          style={styles.button}
        />
      </CustomBackground>
    </KeyboardLayout>
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
