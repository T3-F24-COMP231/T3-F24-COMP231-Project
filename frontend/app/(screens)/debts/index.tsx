import React, { SetStateAction, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Alert,
  Text,
  Switch,
  ScrollView,
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
  KeyboardLayout,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { IDebt } from "@/types";
import { apiRequest, getToken } from "@/utils";
import Checkbox from "expo-checkbox";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DebtsScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState<IDebt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<IDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentDebt, setCurrentDebt] = useState<IDebt | null>(null);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reminderFrequency, setReminderFrequency] = useState("monthly");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (currentUser?._id && token) {
        const data = await apiRequest(
          `/users/${currentUser._id}/debts`,
          "GET",
          undefined,
          token
        );
        setDebts(data || []);
        setFilteredDebts(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch debts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredDebts(debts);
    } else {
      const filteredData = debts.filter(
        (debt) =>
          debt.title.toLowerCase().includes(query.toLowerCase()) ||
          debt.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDebts(filteredData);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelectDebt = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      for (const id of selectedIds) {
        await apiRequest(
          `/users/${currentUser?._id}/debt/${id}`,
          "DELETE",
          undefined,
          token
        );
      }

      Alert.alert("Success", "Selected debts deleted successfully.");
      setDebts(debts.filter((debt) => !selectedIds.includes(debt._id)));
      setFilteredDebts(
        filteredDebts.filter((debt) => !selectedIds.includes(debt._id))
      );
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete selected debts.");
    }
  };

  const handleUpdateDebt = async () => {
    try {
      const token = await getToken();
      if (!token || !currentDebt) return;

      await apiRequest(
        `/users/${currentUser?._id}/debt/${currentDebt._id}`,
        "PUT",
        currentDebt,
        token
      );

      Alert.alert("Success", "Debt updated successfully.");
      setDebts(
        debts.map((debt) => (debt._id === currentDebt._id ? currentDebt : debt))
      );
      setFilteredDebts(
        filteredDebts.map((debt) =>
          debt._id === currentDebt._id ? currentDebt : debt
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update debt.");
    }
  };

  const openModal = (debt: IDebt) => {
    setCurrentDebt(debt);
    setTitle(debt.title);
    setAmount(debt.amount.toString());
    setDescription(debt.description);
    setIsModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.purple} />;
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="All Debts" />
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search debts..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity
          onPress={toggleSelectionMode}
          style={styles.selectButton}
        >
          <Text style={[styles.selectButtonText, { color: theme.purple }]}>
            Select
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <CustomView
              style={[styles.item, { backgroundColor: theme.lightGray }]}
            >
              {isSelectionMode && (
                <Checkbox
                  value={selectedIds.includes(item._id)}
                  onValueChange={(isChecked) =>
                    handleSelectDebt(item._id, isChecked)
                  }
                  color={theme.purple}
                />
              )}
              <View style={styles.itemContent}>
                <CustomText style={styles.title}>{item.title}</CustomText>
                <CustomText>Amount: ${item.amount}</CustomText>
                <CustomText>Description: {item.description}</CustomText>
                <CustomText style={styles.timestamp}>
                  Time:{" "}
                  {new Date(item.date).toLocaleDateString() +
                    " " +
                    new Date(item.date).toLocaleTimeString()}
                </CustomText>
                {item.paymentReminder?.enabled && (
                  <>
                    <CustomText>
                      Reminder: {item.paymentReminder.reminderFrequency}
                    </CustomText>
                    <CustomText>
                      Amount to Pay: ${item.paymentReminder.amountToPay}
                    </CustomText>
                    <CustomText>
                      Reminder Date:{" "}
                      {new Date(
                        item.paymentReminder.reminderDate
                      ).toLocaleString()}
                    </CustomText>
                  </>
                )}
              </View>
            </CustomView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <CustomListEmpty
            message="No Debts Found"
            onRetry={() => fetchDebts()}
          />
        }
      />

      {isSelectionMode && (
        <CustomButton text="Delete Selected" onPress={handleDeleteSelected} />
      )}

      {currentDebt && (
        <ScrollView>
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Update Debt"
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
          <View style={styles.reminderSection}>
            <View style={styles.switchContainer}>
              <CustomText style={styles.switchLabel}>
                Enable Payment Reminder
              </CustomText>
              <Switch
                value={currentDebt?.paymentReminder?.enabled || false}
                onValueChange={(value) =>
                  setCurrentDebt((prev) =>
                    prev
                      ? {
                          ...prev,
                          paymentReminder: {
                            ...prev.paymentReminder,
                            enabled: value,
                          },
                        }
                      : null
                  )
                }
              />
            </View>
            {currentDebt?.paymentReminder?.enabled && (
              <>
                <CustomInput
                  placeholder="Amount to Pay"
                  value={String(currentDebt.paymentReminder?.amountToPay || "")}
                  onChangeText={(value) =>
                    setCurrentDebt((prev) =>
                      prev
                        ? {
                            ...prev,
                            paymentReminder: {
                              ...prev.paymentReminder,
                              amountToPay: parseFloat(value),
                            },
                          }
                        : null
                    )
                  }
                  keyboardType="numeric"
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
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePickerButton}
                >
                  <CustomText style={styles.datePickerText}>
                    {currentDebt.paymentReminder?.reminderDate
                      ? new Date(
                          currentDebt.paymentReminder.reminderDate
                        ).toLocaleDateString()
                      : "Select Reminder Date"}
                  </CustomText>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="datetime"
                    onConfirm={(selectedDate: any) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setCurrentDebt((prev) =>
                          prev
                            ? {
                                ...prev,
                                paymentReminder: {
                                  ...(prev.paymentReminder || {
                                    enabled: false,
                                    amountToPay: 0,
                                    reminderFrequency: "daily",
                                  }),
                                  reminderDate: selectedDate,
                                },
                              }
                            : null
                        );
                      }
                    }}
                    onCancel={() => setShowDatePicker(false)}
                  />
                )}
              </>
            )}
          </View>
          <CustomButton text="Update Debt" onPress={handleUpdateDebt} />
        </CustomModal>
        </ScrollView>
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
    fontWeight: "bold",
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 5,
  },
  reminderSection: {
    width: "100%",
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginTop: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: "#555",
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
});
