import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  CustomBackground,
  CustomButtomSheet,
  CustomButton,
} from "@/components";
import { router } from "expo-router";

const { width: WIDTH } = Dimensions.get("screen");

export default function Add() {

  return (
    <CustomBackground style={styles.background}>
      <CustomButtomSheet title="Add">
        <View style={[{ backgroundColor: "transparent" }]}>
          <CustomButton
            text="Add Income"
            onPress={() => router.push("/(screens)/AddIncomeScreen")}
          />
          <CustomButton
            text="Add Expense"
            onPress={() => router.push("/(screens)/AddExpenseScreen")}
          />
          <CustomButton
            text="Add Debt"
            onPress={() => router.push("/(screens)/AddDebtScreen")}
          />
        </View>
      </CustomButtomSheet>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
    padding: 0,
    width: WIDTH,
  },
});
