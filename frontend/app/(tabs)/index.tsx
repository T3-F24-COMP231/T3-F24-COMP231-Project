import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  CustomBackground,
  CustomText,
  CustomButton,
  CustomInput,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { fetchExpenseSummary, fetchIncomeSummary } from "@/utils";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { currentUser, fetchCurrentUser, isLoading } = useAuth();
  const [incomesTotal, setIncomesTotal] = useState<number>(0);
  const [expensesTotal, setExpensesTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
console.log(currentUser?._id)
  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadSummaryData();
    }
  }, [currentUser]);

  const loadSummaryData = async () => {
    try {
      if (currentUser?._id) {
        const incomeData = await fetchIncomeSummary(currentUser._id);
        const expenseData = await fetchExpenseSummary(currentUser._id);

        setIncomesTotal(incomeData.totalAmount || 0);
        setExpensesTotal(expenseData.totalAmount || 0);
      }
    } catch (error) {
      console.error("Failed to load summary data:", error);
    }
  };

  if (isLoading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4a5dff" />
      </CustomBackground>
    );
  }

  if (!currentUser) {
    router.push("/(auth)/login");
    return null;
  }

  return (
    <CustomBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <CustomText style={styles.userName}>{currentUser.name}</CustomText>
          <CustomText style={styles.userRole}>{currentUser.role}</CustomText>
        </View>

        {/* Search Bar */}
        <CustomInput
          placeholder="Search.."
          value={search}
          onChangeText={setSearch}
        />

        {/* Current Balance Section */}
        <View style={styles.balanceSection}>
          <CustomText style={styles.balanceLabel}>Current Balance</CustomText>
          <CustomText style={styles.balanceAmount}>
            ${incomesTotal - expensesTotal}
          </CustomText>
        </View>

        {/* Income and Expense Summary */}
        <View style={styles.summarySection}>
          <TouchableOpacity style={[styles.card, styles.incomeCard]}>
            <CustomText style={styles.cardTitle}>Income</CustomText>
            <CustomText style={styles.cardAmount}>${incomesTotal}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, styles.expenseCard]}>
            <CustomText style={styles.cardTitle}>Expense</CustomText>
            <CustomText style={styles.cardAmount}>${expensesTotal}</CustomText>
          </TouchableOpacity>
        </View>

        {/* Transaction List Header */}
        <CustomText style={styles.transactionHeader}>Transactions</CustomText>

        {/* Transaction Items (Placeholder) */}
        <View style={styles.transactionItem}>
          <CustomText>Utility Bill</CustomText>
          <CustomText>$500.12</CustomText>
        </View>
        <View style={styles.transactionItem}>
          <CustomText>Shopping</CustomText>
          <CustomText>$200.50</CustomText>
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
  scrollView: {
    alignItems: "center",
  },
  profileSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userRole: {
    fontSize: 14,
    color: "#aaaaaa",
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
  },
  balanceSection: {
    width: "100%",
    padding: 20,
    backgroundColor: "#1e1f38",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4a5dff",
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  incomeCard: {
    backgroundColor: "#2d3436",
  },
  expenseCard: {
    backgroundColor: "#d63031",
  },
  cardTitle: {
    fontSize: 16,
    color: "#ffffff",
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  transactionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
});
