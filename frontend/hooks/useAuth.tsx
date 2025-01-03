import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../types";
import { BASE_URL } from "@/api";
import { Alert } from "react-native";
import { router } from "expo-router";
import { getToken } from "@/utils";

interface AuthContextType {
  currentUser: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    try {
      const token = await getToken()
      if (!token) {
        setCurrentUser(null);
        return;
      }

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }

      const { data } = await response.json();
      setCurrentUser(data);
      await AsyncStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error) {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { data } = await response.json();
      setCurrentUser(data.user);
      await AsyncStorage.setItem("currentUser", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occured";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed with status ${response.status}`);
      }

      const { message } = await response.json();
      Alert.alert("Success", message || "Account created successfully!");
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Signup Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occured";
      Alert.alert("Signup Failed", errorMessage || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = await getToken()

      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
    } finally {
      setCurrentUser(null);
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("token");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        signup,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
