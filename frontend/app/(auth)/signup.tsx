import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useAuth, useTheme } from "@/hooks";
import {
  CustomBackground,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { useRouter } from "expo-router";

const Signup = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    if (!acceptedTerms) {
      return Alert.alert("Error", "Please accept the terms and conditions.");
    }

    try {
      setLoading(true);
      await signup(name, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.push("/(tabs)");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred.";
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomText style={styles.title}>Create An Account</CustomText>
        <CustomText style={styles.subtitle}>
          Fill in the form and create a new account
        </CustomText>

        <CustomInput placeholder="Name" value={name} onChangeText={setName} />
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <CustomInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <CustomInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Terms and Conditions Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={acceptedTerms}
            onValueChange={setAcceptedTerms}
            color={acceptedTerms ? "#4A5DFF" : undefined}
          />
          <CustomText style={styles.checkboxText}>
            Accept All Terms And Conditions
          </CustomText>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <CustomText style={styles.signupButtonText}>Sign Up</CustomText>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.altButton}>
          <CustomText>Already have an account? </CustomText>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={{ color: "#4A5DFF" }}>Log In</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </CustomBackground>
    </KeyboardLayout>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  checkboxText: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: "#4a5dff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  altButton: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
