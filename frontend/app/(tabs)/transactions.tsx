import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  CustomBackground,
  CustomHeader,
  CustomListEmpty,
  CustomText,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/utils";
import { ITransaction } from "@/types";

const TransactionScreen = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!currentUser?._id || !token) return;

      const response = await apiRequest(
        `/users/${currentUser._id}/transactions`,
        "GET",
        undefined,
        token
      );

      setTransactions(response || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color={theme.purple} />
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <CustomListEmpty
            message="No transactions found"
            onRetry={() => fetchTransactions()}
          />
        }
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
  listContent: {
    paddingBottom: 70,
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
