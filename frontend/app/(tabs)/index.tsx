import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { CustomBackground, CustomHeader, CustomText } from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { useRouter } from "expo-router";
import { IExpense, IIncome, IDebt } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, CleanOutput } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

type ValidRoutes =
  | "/(screens)/incomes"
  | "/(screens)/incomes/AddIncomeScreen"
  | "/(screens)/expenses"
  | "/(screens)/expenses/AddExpenseScreen"
  | "/(screens)/debts"
  | "/(screens)/debts/AddDebtScreen"
  | "/(screens)/savings"
  | "/(screens)/savings/AddSavingsScreen";

interface ICardData {
  title: string;
  viewAllRoute: ValidRoutes;
  addNewRoute: ValidRoutes;
  getTotal: () => number;
  buttonText: string;
}
export default function Index() {
  const { theme } = useTheme();
  const { currentUser, isLoading } = useAuth();
  const [incomes, setIncomes] = useState<IIncome[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [debts, setDebts] = useState<IDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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
        <ActivityIndicator size="large" color={theme.purple} />
      </CustomBackground>
    );
  }

  const cardData: ICardData[] = [
    {
      title: "Income",
      viewAllRoute: "/(screens)/incomes",
      addNewRoute: "/(screens)/incomes/AddIncomeScreen",
      getTotal: getTotalIncome,
      buttonText: "Add New Income",
    },
    {
      title: "Expense",
      viewAllRoute: "/(screens)/expenses",
      addNewRoute: "/(screens)/expenses/AddExpenseScreen",
      getTotal: getTotalExpense,
      buttonText: "Add New Expense",
    },
    {
      title: "Debt",
      viewAllRoute: "/(screens)/debts",
      addNewRoute: "/(screens)/debts/AddDebtScreen",
      getTotal: getTotalDebt,
      buttonText: "Add New Debt",
    },
    {
      title: "Savings",
      viewAllRoute: "/(screens)/savings",
      addNewRoute: "/(screens)/savings/AddSavingsScreen",
      getTotal: () => 0,
      buttonText: "Add New Savings",
    },
  ];

  return (
    <CustomBackground style={styles.container}>
      {currentUser ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <CustomHeader
            title={`Welcome, ${currentUser.name}`}
            rightItems={[
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  color={theme.text}
                  size={24}
                />
              </TouchableOpacity>,
            ]}
          />

          {/* Current Balance Section */}
          <View style={styles.balanceSection}>
            <CustomText style={styles.balanceLabel}>Current Balance</CustomText>
            <Text style={[styles.balanceAmount, { color: theme.purple }]}>
              $
              {CleanOutput(
                getTotalIncome() - getTotalExpense() - getTotalDebt()
              )}
            </Text>
          </View>

          {/* Income, Expense, and Debt Summary */}
          <View style={styles.summarySection}>
            {cardData.map((card, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardTitle}>
                  <Text style={styles.cardTitleText}>{card.title}</Text>
                  <TouchableOpacity
                    onPress={() => router.push(card.viewAllRoute)}
                    style={styles.cardTitleButton}
                  >
                    <Text style={styles.cardTitleButtonText}>VIEW ALL </Text>
                    <Ionicons name="arrow-forward" size={16} color="#4A5DFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.currency}>
                    <Text style={styles.currencyText}>$</Text>
                  </View>
                  <View style={styles.cardTotalView}>
                    <Text style={styles.cardTotalText}>Today's Total</Text>
                    <Text style={styles.cardAmount}>
                      {CleanOutput(card.getTotal())}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push(card.addNewRoute)}
                >
                  <Ionicons name="add-circle" size={16} color="#4A5DFF" />
                  <Text style={styles.actionButtonText}>{card.buttonText}</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    backgroundColor: "#040D12",
    borderRadius: 10,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "800",
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
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#040D12",
  },
  cardTitle: {
    width: "100%",
    height: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#393E46",
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitleText: {
    fontSize: 20,
    color: "#4A5DFF",
  },
  cardTitleButton: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  cardTitleButtonText: {
    color: "#9BA4B4",
  },
  cardContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    columnGap: 20,
  },
  iconWrapper: {
    height: 15,
    width: 15,
    borderRadius: 100,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  currency: {
    height: 50,
    width: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#31363F",
  },
  currencyText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#4A5DFF",
  },
  cardTotalView: {
    rowGap: 5,
  },
  cardTotalText: {
    fontSize: 20,
    color: "gray",
  },
  cardAmount: {
    fontSize: 24,
    color: "#ffffff",
  },
  actionButton: {
    width: "95%",
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#393E46",
    paddingHorizontal: 15,
    borderRadius: 7,
    columnGap: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 18,
    color: "white",
  },
});
