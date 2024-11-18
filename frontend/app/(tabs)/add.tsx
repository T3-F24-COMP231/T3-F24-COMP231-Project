import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  CustomBackground,
  CustomButtomSheet,
  CustomButton,
  CustomView,
} from "@/components";
import { router } from "expo-router";

const { width: WIDTH } = Dimensions.get("screen");

export default function Add() {
  return (
    <CustomBackground style={styles.background}>
      <CustomView style={styles.wrapper}>
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
      </CustomView>
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
  wrapper: {
    minWidth: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
