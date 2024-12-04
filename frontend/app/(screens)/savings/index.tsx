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
import Checkbox from "expo-checkbox";
import { useAuth, useTheme } from "@/hooks";
import { ISaving } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  apiRequest,
  deleteSaving,
  fetchAllSavings,
  updateDebt,
  updateSaving,
} from "@/utils";

export default function SavingsScreen() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [savings, setSavings] = useState<ISaving[]>([]);
  const [filteredSavings, setFilteredSavings] = useState<ISaving[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentSaving, setCurrentSaving] = useState<ISaving | null>(null);
  const [purpose, setPurpose] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [savedAmount, setSavedAmount] = useState<string>("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  const fetchSavings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        const data = await fetchAllSavings(currentUser._id, token);
        setSavings(data || []);
        setFilteredSavings(data || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch savings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredSavings(savings);
    } else {
      const filteredData = savings.filter((saving) =>
        saving.purpose.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSavings(filteredData);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelectSaving = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!currentUser?._id || !token) return;

      for (const id of selectedIds) {
        await deleteSaving(currentUser?._id, id, token);
      }

      Alert.alert("Success", "Selected savings deleted successfully.");
      fetchSavings();
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete selected savings.");
    }
  };

  const handleUpdateSaving = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !currentSaving || !currentUser?._id) return;
      const updatedSaving = {
        purpose,
        goalAmount: parseFloat(goalAmount),
        savedAmount: parseFloat(savedAmount),
      };
      await updateSaving(
        currentUser?._id,
        currentSaving._id,
        updatedSaving,
        token
      );

      Alert.alert("Success", "Saving updated successfully.");
      fetchSavings();
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update saving.");
    }
  };

  const openModal = (saving: ISaving) => {
    setCurrentSaving(saving);
    setPurpose(saving.purpose);
    setGoalAmount(saving.goalAmount.toString());
    setSavedAmount(saving.savedAmount.toString());
    setIsModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.purple} />;
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="All Savings" />
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search savings..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity
          onPress={toggleSelectionMode}
          style={styles.selectButton}
        >
          <Text style={[styles.selectButtonText, { color: theme.purple }]}>
            {isSelectionMode ? "Cancel" : "Select"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSavings}
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
                    handleSelectSaving(item._id, isChecked)
                  }
                  color={theme.purple}
                />
              )}
              <View style={styles.itemContent}>
                <CustomText style={styles.title}>{item.purpose}</CustomText>
                <CustomText>Goal: ${item.goalAmount}</CustomText>
                <CustomText>Saved: ${item.savedAmount}</CustomText>
                <CustomText>
                  Progress:{" "}
                  {((item.savedAmount / item.goalAmount) * 100).toFixed(2)}%
                </CustomText>
              </View>
            </CustomView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <CustomListEmpty
            message="No Savings Found"
            onRetry={() => fetchSavings()}
          />
        }
      />

      {isSelectionMode && (
        <CustomButton text="Delete Selected" onPress={handleDeleteSelected} />
      )}

      {currentSaving && (
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Update Saving"
        >
          <CustomInput
            placeholder="Purpose"
            value={purpose}
            onChangeText={setPurpose}
          />
          <CustomInput
            placeholder="Goal Amount"
            value={goalAmount}
            onChangeText={setGoalAmount}
            keyboardType="numeric"
          />
          <CustomInput
            placeholder="Saved Amount"
            value={savedAmount}
            onChangeText={setSavedAmount}
            keyboardType="numeric"
          />
          <CustomButton text="Update Saving" onPress={handleUpdateSaving} />
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
  },
  selectButtonText: {
    fontSize: 16,
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
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
