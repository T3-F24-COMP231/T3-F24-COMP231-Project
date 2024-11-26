import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import {
  CustomBackground,
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  KeyboardLayout,
} from "@/components";
import { addDebt } from "@/utils";
import { useAuth, useTheme } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AddDebtScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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
        <CustomBottomSheet
          title="Add New Debt"
          style={{ backgroundColor: theme.background }}
        >
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
              text="Submit Debt"
              onPress={handleAddDebt}
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
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});
