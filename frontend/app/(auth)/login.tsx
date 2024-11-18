import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { useAuth, useTheme } from "@/hooks";
import {
  CustomBackground,
  CustomInput,
  CustomText,
  KeyboardLayout,
} from "@/components";
import { router } from "expo-router";

const Login = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    try {
      setLoading(true);
      await login(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.push("/(tabs)");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardLayout>
      <CustomBackground style={styles.container}>
        <CustomText style={styles.title}>Welcome Back</CustomText>
        <CustomText style={styles.subtitle}>
          Please log in to your account
        </CustomText>

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

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <CustomText style={styles.loginButtonText}>Log In</CustomText>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.altButton}>
          <CustomText>Don't have an account? </CustomText>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={{ color: "#4A5DFF" }}>Sign Up</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </CustomBackground>
    </KeyboardLayout>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "100%",
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
  loginButton: {
    backgroundColor: "#4a5dff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loginButtonText: {
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
