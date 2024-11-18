import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CustomBackground, CustomText, CustomInput } from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { useRouter } from "expo-router";
import { IExpense, IIncome, IDebt } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, formatNumber } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const {theme} = useTheme();
  const { currentUser, isLoading } = useAuth();
  const [incomes, setIncomes] = useState<IIncome[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [debts, setDebts] = useState<IDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  // Redirect if user is not logged in and not loading
  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.replace("/(auth)/login");
    }
  }, [currentUser, isLoading, router]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (currentUser?._id && token) {
          // Fetch incomes
          const incomesData = await apiRequest(
            `/users/${currentUser._id}/incomes`,
            "GET",
            undefined,
            token
          );
          setIncomes(incomesData || []);

          // Fetch expenses
          const expensesData = await apiRequest(
            `/users/${currentUser._id}/expenses`,
            "GET",
            undefined,
            token
          );
          setExpenses(expensesData || []);

          // Fetch debts
          const debtsData = await apiRequest(
            `/users/${currentUser._id}/debts`,
            "GET",
            undefined,
            token
          );
          setDebts(debtsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Calculate total income, expense, and debt
  const getTotalIncome = () =>
    incomes.reduce((total, income) => total + (income.amount || 0), 0);

  const getTotalExpense = () =>
    expenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  const getTotalDebt = () =>
    debts.reduce((total, debt) => total + (debt.amount || 0), 0);

  if (isLoading || loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4a5dff" />
      </CustomBackground>
    );
  }

  return (
    <CustomBackground style={styles.container}>
      {currentUser ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <CustomText style={styles.userName}>Welcome, {currentUser.name}</CustomText>
            <TouchableOpacity onPress={() => router.push("/(tabs)/notifications")}>
            <Ionicons name="notifications-outline" color={theme.text} size={24} />
            </TouchableOpacity>
          </View>

          {/* Current Balance Section */}
          <View style={styles.balanceSection}>
            <CustomText style={styles.balanceLabel}>Current Balance</CustomText>
            <CustomText style={styles.balanceAmount}>
              ${formatNumber(getTotalIncome() - getTotalExpense() - getTotalDebt())}
            </CustomText>
          </View>

          {/* Income, Expense, and Debt Summary */}
          <View style={styles.summarySection}>
            <TouchableOpacity
              style={[styles.card, styles.incomeCard]}
              onPress={() => router.push("/(screens)/IncomeScreen")}
            >
              <CustomText style={styles.cardTitle}>Total Income</CustomText>
              <CustomText style={styles.cardAmount}>
                ${formatNumber(getTotalIncome())}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, styles.expenseCard]}
              onPress={() => router.push("/(screens)/ExpenseScreen")}
            >
              <CustomText style={styles.cardTitle}>Total Expense</CustomText>
              <CustomText style={styles.cardAmount}>
                ${formatNumber(getTotalExpense())}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, styles.debtCard]}
              onPress={() => router.push("/(screens)/DebtScreen")}
            >
              <CustomText style={styles.cardTitle}>Total Debt</CustomText>
              <CustomText style={styles.cardAmount}>
                ${formatNumber(getTotalDebt())}
              </CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
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
    marginBottom: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
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
    width: "100%",
    alignItems: "center",
    marginHorizontal: "auto",
    flexWrap: "wrap",
    marginBottom: 20,
    rowGap: 20,
  },
  card: {
    flex: 1,
    width: "95%",
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
  debtCard: {
    backgroundColor: "#ff6347",
  },
  cardTitle: {
    fontSize: 30,
    color: "#ffffff",
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
