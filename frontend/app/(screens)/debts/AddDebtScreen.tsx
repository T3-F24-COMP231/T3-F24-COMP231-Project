import React, { useState } from "react";
import { StyleSheet, Alert, View, Switch, TouchableOpacity, Text } from "react-native";
import {
  CustomBackground,
  CustomButton,
  CustomHeader,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { addDebt, getToken } from "@/utils";
import { useAuth, useTheme } from "@/hooks";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddDebtScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Reminder-related states
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderAmount, setReminderAmount] = useState("");
  const [reminderFrequency, setReminderFrequency] = useState("monthly");
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setEnableReminder(false);
    setReminderAmount("");
    setReminderFrequency("monthly");
    setReminderDate(null);
  };

  const handleAddDebt = async () => {
    try {
      const token = await getToken();
      if (currentUser?._id && token) {
        const debtPayload = {
          title,
          amount: parseFloat(amount),
          description,
          paymentReminder: enableReminder
            ? {
                enabled: true,
                amountToPay: parseFloat(reminderAmount),
                reminderFrequency,
                reminderDate,
              }
            : {
                enabled: false,
              },
        };

        await addDebt(currentUser._id, debtPayload, token);

        Alert.alert(
          "Success",
          "Debt added successfully!",
          [
            {
              text: "Add a new Debt",
              onPress: resetForm,
            },
            {
              text: "View Debts",
              onPress: () => router.replace("/(screens)/debts"),
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setReminderDate(date);
    hideDatePicker();
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomHeader back title="Add New Debt"/>
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

          {/* Reminder Section */}
          <View style={styles.reminderSection}>
            <View style={styles.reminderToggle}>
              <Text style={{ color: theme.text }}>Enable Reminder</Text>
              <Switch
                value={enableReminder}
                onValueChange={setEnableReminder}
                thumbColor={enableReminder ? theme.purple : "#ccc"}
              />
            </View>

            {enableReminder && (
              <>
                <CustomInput
                  placeholder="Reminder Amount"
                  value={reminderAmount}
                  onChangeText={setReminderAmount}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <View style={styles.pickerContainer}>
                  <Text style={{ color: theme.text }}>Reminder Frequency</Text>
                  <TouchableOpacity
                    style={styles.frequencyButton}
                    onPress={() =>
                      setReminderFrequency((prev) =>
                        prev === "daily"
                          ? "weekly"
                          : prev === "weekly"
                          ? "monthly"
                          : "daily"
                      )
                    }
                  >
                    <Text style={{ color: theme.text }}>
                      {reminderFrequency.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                  <Text style={{ color: theme.text }}>
                    {reminderDate
                      ? reminderDate.toLocaleString()
                      : "Select Reminder Date"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirmDate}
                  onCancel={hideDatePicker}
                />
              </>
            )}
          </View>

          <CustomButton
            text="Submit Debt"
            onPress={handleAddDebt}
            style={styles.button}
          />
        </View>
      </CustomBackground>
    </KeyboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  reminderSection: {
    marginVertical: 20,
  },
  reminderToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  frequencyButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  datePicker: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    alignItems: "center",
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});
