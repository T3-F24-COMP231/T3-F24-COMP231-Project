import { BASE_URL } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchIncomeSummary = async (userId: string) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/users/${userId}/income/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch income summary");
  const data = await response.json();
  const totalAmount = data.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );
  return { totalAmount };
};

export const fetchExpenseSummary = async (userId: string) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/users/${userId}/expense/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch expense summary");
  const data = await response.json();
  const totalAmount = data.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );
  return { totalAmount };
};

const apiRequest = async (
  endpoint: string,
  method: string,
  body?: object,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

export const addDebt = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/debt`, "POST", data, token);

export const addExpense = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/expense`, "POST", data, token);

export const addIncome = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/income`, "POST", data, token);
