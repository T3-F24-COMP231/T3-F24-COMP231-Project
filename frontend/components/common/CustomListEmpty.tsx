import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import CustomButton from "./CustomButton";

interface ListEmptyProps {
  message?: string;
  onRetry?: () => void;
}

const ListEmpty: React.FC<ListEmptyProps> = ({
  message = "No items found.",
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/empty-list.png")}
        width={100}
        height={100}
        style={styles.image}
      />

      <Text style={styles.message}>{message}</Text>

      {/* Retry Button */}
      {onRetry && <CustomButton text="Retry" onPress={onRetry} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    marginBottom: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  message: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4A5DFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListEmpty;
