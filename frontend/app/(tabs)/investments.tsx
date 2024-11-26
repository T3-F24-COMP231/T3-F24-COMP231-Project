import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  CustomBackground,
  CustomText,
  CustomButton,
  CustomHeader,
  CustomInput,
  KeyboardLayout,
} from "@/components";
import { useAuth } from "@/hooks";
import { apiRequest, CleanOutput, fetchAllInvestments, hasPermission } from "@/utils";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IInvestment } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export default function Investment() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState<IInvestment[]>([]);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalReturns, setTotalReturns] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (currentUser?._id && token) {
        const data = await fetchAllInvestments(currentUser._id,token);
        setInvestments(data || []);
        calculateTotals(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [currentUser]);

  const calculateTotals = (data: IInvestment[]) => {
    const totalAmount = data.reduce((acc, inv) => acc + inv.amount, 0);
    const totalReturn = data.reduce(
      (acc, inv) => acc + (inv.amount * inv.returnPercentage) / 100,
      0
    );
    setTotalInvestment(totalAmount);
    setTotalReturns(totalReturn);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      fetchInvestments();
    } else {
      const filteredData = investments.filter((inv) =>
        inv.title.toLowerCase().includes(query.toLowerCase())
      );
      setInvestments(filteredData);
    }
  };

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color="#4a5dff" />
      </CustomBackground>
    );
  }

  return (
    <KeyboardLayout>
      <CustomBackground>
        {currentUser && !hasPermission(currentUser, "view:investments") ? (
          <>
            <CustomHeader title="Investment Overview" />
            <View style={styles.wrapper}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryTitle}>My Portfolio</Text>
                  <Text style={styles.summaryValue}>
                    ${CleanOutput(totalInvestment.toFixed(2))}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryTitle}>My Returns</Text>
                  <Text style={styles.summaryValue}>
                    ${CleanOutput(totalReturns.toFixed(2))}
                  </Text>
                </View>
              </View>

              {/* Search Bar */}
              <CustomInput
                placeholder="Search investments..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchBar}
              />

              {/* Investment List */}
              <FlatList
                data={investments.slice(0, 4)}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.investmentDetails}>
                    <Text
                      style={[styles.investmentText, styles.investmentTitle]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.investmentText}>
                      Amount: ${item.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.investmentText}>
                      Return: {item.returnPercentage}%
                    </Text>
                    <Text style={styles.investmentText}>
                      Date:{" "}
                      {new Date(item.date).toLocaleDateString() +
                        " " +
                        new Date(item.date).toLocaleTimeString()}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={
                  <CustomText>No investments found.</CustomText>
                }
              />

              {/* Operation Buttons */}
              <View style={styles.operationButtonsView}>
                <CustomButton
                  text="Add New Investment"
                  onPress={() =>
                    router.push("/(screens)/investments/AddInvestmentScreen")
                  }
                  style={styles.operationButton}
                />
                <TouchableOpacity
                  onPress={() => router.push("/(screens)/investments")}
                  style={[
                    styles.operationButton,
                    { borderWidth: 1, borderColor: "gray" },
                  ]}
                >
                  <Text style={styles.investmentText}>
                    View all investments{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <CustomText>Investment page not available</CustomText>
        )}
      </CustomBackground>
    </KeyboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wrapper: {
    height: "90%",
    justifyContent: "space-between",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    width: "49%",
    backgroundColor: "#2D3436",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
  summaryValue: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#4A5DFF",
  },
  searchBar: {
    marginBottom: 16,
    width: "100%",
  },
  investmentDetails: {
    backgroundColor: "#393E46",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    rowGap: 10,
    marginBottom: 10,
  },
  investmentText: {
    color: "#fff",
  },
  investmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  operationButtonsView: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  operationButton: {
    borderRadius: 10,
    width: "48%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
