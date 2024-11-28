import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import {
  CustomBackground,
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { useAuth } from "@/hooks";
import { router } from "expo-router";
import { addInvestment } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddInvestmentScreen() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [returnPercentage, setReturnPercentage] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setReturnPercentage("");
    setDescription("");
  };

  const handleAddInvestment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        const payload = {
          userId: currentUser?._id,
          title,
          amount: parseFloat(amount),
          returnPercentage: parseFloat(returnPercentage),
          description,
        };
        await addInvestment(currentUser?._id, payload, token);
        // Alert with options
        Alert.alert(
          "Success",
          "Investment added successfully!",
          [
            {
              text: "Add a new Investment",
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
      Alert.alert("Error", `Failed to add investment: ${errorMessage}`);
    }
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomBottomSheet title="Add New Investment">
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
              placeholder="Return Percentage"
              value={returnPercentage}
              onChangeText={setReturnPercentage}
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
              text="Submit Investment"
              onPress={handleAddInvestment}
              style={styles.button}
            />
          </View>
        </CustomBottomSheet>
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
  button: {
    width: "100%",
    marginTop: 20,
  },
});
