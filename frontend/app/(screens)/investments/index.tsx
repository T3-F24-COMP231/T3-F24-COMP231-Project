import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  CustomBackground,
  CustomHeader,
  CustomText,
  CustomInput,
  CustomButton,
  CustomModal,
} from "@/components";
import { useAuth } from "@/hooks";
import {
  fetchAllInvestments,
  updateInvestment,
  deleteInvestment,
  getToken,
} from "@/utils";

interface Investment {
  _id: string;
  title: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function InvestmentScreen() {
  const { currentUser } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!currentUser?._id || !token) return;

      const data = await fetchAllInvestments(currentUser._id, token);
      setInvestments(data || []);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [currentUser]);

  const openModal = (investment: Investment) => {
    setSelectedInvestment(investment);
    setTitle(investment.title);
    setAmount(investment.amount.toString());
    setDescription(investment.description);
    setModalVisible(true);
  };

  const handleUpdateInvestment = async () => {
    try {
      if (!selectedInvestment) return;
      const token = await getToken();
      if (!token || !currentUser?._id) return;

      const updatedData = {
        title,
        amount: parseFloat(amount),
        description,
      };

      await updateInvestment(
        currentUser._id,
        selectedInvestment._id,
        updatedData,
        token
      );

      Alert.alert("Success", "Investment updated successfully.");
      fetchInvestments();
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update investment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async () => {
    try {
      if (!selectedInvestment) return;
      const token = await getToken();
      if (!token || !currentUser?._id) return;

      await deleteInvestment(currentUser._id, selectedInvestment._id, token);

      Alert.alert("Success", "Investment deleted successfully.");
      fetchInvestments();
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete investment.");
    }
  };

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4A5DFF" />
      </CustomBackground>
    );
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader back title="All My Investments" />

      <FlatList
        data={investments}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchInvestments} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => openModal(item)}
          >
            <CustomText style={styles.title}>{item.title}</CustomText>
            <CustomText style={styles.amount}>
              ${item.amount.toFixed(2)}
            </CustomText>
            <CustomText style={styles.description}>
              {item.description}
            </CustomText>
            <CustomText style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString() +
                " " +
                new Date(item.createdAt).toLocaleTimeString()}
            </CustomText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <CustomText style={styles.emptyMessage}>
            No investments found.
          </CustomText>
        }
      />

      {selectedInvestment && (
        <CustomModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Update Investment"
        >
          <View style={styles.modalContent}>
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
            <CustomButton
              text="Update Investment"
              onPress={handleUpdateInvestment}
              buttonStyle={styles.button}
            />
            <CustomButton
              text="Delete Investment"
              onPress={handleDeleteInvestment}
              backgroundColor="red"
              buttonStyle={styles.button}
            />
          </View>
        </CustomModal>
      )}
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#393E46",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A5DFF",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#9BA4B4",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#B0BEC5",
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#9BA4B4",
  },
  modalContent: {
    width: "100%",
  },
  button: {
    width: "100%",
    marginHorizontal: "auto",
  },
});
