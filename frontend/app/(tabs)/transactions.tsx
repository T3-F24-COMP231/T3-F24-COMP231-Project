import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { CustomBackground, CustomHeader, CustomText } from "@/components";
import { useAuth } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  description: string;
  type: "income" | "debt" | "expense" | "investment";
  createdAt: string;
}

const TransactionScreen = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!currentUser?._id || !token) return;

        const [incomeData, debtData, expenseData, investmentData] =
          await Promise.all([
            apiRequest(
              `/users/${currentUser._id}/incomes`,
              "GET",
              undefined,
              token
            ),
            apiRequest(
              `/users/${currentUser._id}/debts`,
              "GET",
              undefined,
              token
            ),
            apiRequest(
              `/users/${currentUser._id}/expenses`,
              "GET",
              undefined,
              token
            ),
            apiRequest(
              `/users/${currentUser._id}/investments`,
              "GET",
              undefined,
              token
            ),
          ]);

        // Combine and label transactions
        const formattedTransactions: Transaction[] = [
          ...(incomeData || []).map((item: any) => ({
            ...item,
            type: "income",
          })),
          ...(debtData || []).map((item: any) => ({
            ...item,
            type: "debt",
          })),
          ...(expenseData || []).map((item: any) => ({
            ...item,
            type: "expense",
          })),
          ...(investmentData || []).map((item: any) => ({
            ...item,
            type: "investment",
          })),
        ];

        // Sort transactions by date (most recent first)
        formattedTransactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4a5dff" />
      </CustomBackground>
    );
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader title="Transactions" />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const textColor =
            item.type === "income"
              ? "green"
              : item.type === "debt"
              ? "yellow"
              : item.type === "expense"
              ? "red"
              : "#4a5dff";

          return (
            <View style={styles.itemContainer}>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>...</Text>
              </TouchableOpacity>
              <View style={styles.item}>
                <View>
                  <CustomText style={styles.title}>{item.title}</CustomText>
                  <CustomText style={styles.type}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </CustomText>
                </View>

                <CustomText>
                  <Text style={{ color: textColor }}>
                    {item.type === "income" || item.type === "investment"
                      ? "+"
                      : item.type === "expense"
                      ? "-"
                      : ""}
                    ${item.amount.toFixed(2)}
                  </Text>
                </CustomText>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<CustomText>No transactions found.</CustomText>}
      />
    </CustomBackground>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: "column",
    height: "auto",
    backgroundColor: "#393E46",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
    borderRadius: 10,
  },
  moreButton: {
    width: "100%",
    height: 20,
    paddingHorizontal: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  moreButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  item: {
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  type: {
    color: "#9BA4B4",
  },
});
