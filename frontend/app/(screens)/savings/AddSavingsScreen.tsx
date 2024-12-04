import React, { useState } from "react";
import { StyleSheet, Alert, View, ScrollView } from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomInput,
  CustomHeader,
} from "@/components";
import { useAuth } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSaving, getToken } from "@/utils";
import { router } from "expo-router";

export default function AddSavingsScreen() {
  const { currentUser } = useAuth();
  const [purpose, setPurpose] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [savedAmount, setSavedAmount] = useState<string>("");

  const resetForm = () => {
    setPurpose("");
    setGoalAmount("");
    setSavedAmount("");
  };

  const handleAddSaving = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token not found.");
        return;
      }
      if (!currentUser?._id) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      const newSaving = {
        userId: currentUser._id,
        purpose,
        goalAmount: parseFloat(goalAmount),
        savedAmount: parseFloat(savedAmount),
      };

      await addSaving(currentUser._id, newSaving, token);
      Alert.alert(
        "Success",
        "Saving added successfully!",
        [
          {
            text: "Add another saving",
            onPress: resetForm,
          },
          {
            text: "View Savings",
            onPress: () => router.replace("/(screens)/savings"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error adding saving:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? `Failed to add saving: ${error.message}`
          : "Failed to add saving."
      );
    }
  };

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="Add Savings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomInput
          placeholder="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          style={styles.input}
        />
        <CustomInput
          placeholder="Savings Goal Amount"
          value={goalAmount}
          onChangeText={setGoalAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <CustomInput
          placeholder="Amount Saved"
          value={savedAmount}
          onChangeText={setSavedAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <CustomButton text="Add Saving" onPress={handleAddSaving} />
        </View>
      </ScrollView>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
