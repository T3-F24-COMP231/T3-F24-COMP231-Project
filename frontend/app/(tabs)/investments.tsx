import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  CustomBackground,
  CustomText,
  CustomButton,
  CustomHeader,
  CustomInput,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { fetchAllInvestments, formatNumber } from "@/utils";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IInvestment } from "@/types";

export default function Investment() {
  const {theme} = useTheme();
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
        const data = await fetchAllInvestments(currentUser._id, token);
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

  const renderInvestment = ({ item }: { item: IInvestment }) => (
    <View style={styles.investmentDetails}>
      <Text style={[styles.investmentText, styles.investmentTitle]}>
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
  );

  const renderHeader = () => (
    <View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>My Portfolio</Text>
          <Text style={styles.summaryValue}>
            ${formatNumber(totalInvestment)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>My Returns</Text>
          <Text style={styles.summaryValue}>${formatNumber(totalReturns)}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <CustomInput
        placeholder="Search investments..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
      />
    </View>
  );

  const renderFooter = () => (
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
        <Text style={styles.investmentText}>View all investments</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <CustomBackground style={styles.container}>
        <ActivityIndicator size="large" color={theme.purple}/>
      </CustomBackground>
    );
  }

  return (
    <CustomBackground style={styles.container}>
      <CustomHeader
        title={`Investment Overview - (${investments.length} Investment${
          investments.length === 1 ? "" : "s"
        })`}
      />
      <FlatList
        data={investments}
        keyExtractor={(item) => item._id}
        renderItem={renderInvestment}
        ListHeaderComponent={renderHeader}
        // ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <CustomText style={styles.emptyMessage}>
            No investments found.
          </CustomText>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchInvestments} />
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      {renderFooter()}
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    height: "80%",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    width: "48%",
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
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#9BA4B4",
    marginTop: 20,
  },
});
