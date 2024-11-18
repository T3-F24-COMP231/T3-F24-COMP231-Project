import { BASE_URL } from "@/api";

export const apiRequest = async (
  endpoint: string,
  method: string,
  body?: object,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Only include the body for non-GET requests
  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};


export const fetchAllIncomes = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/incomes`, "GET", undefined, token);

export const fetchAllExpenses = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/expenses`, "GET", undefined, token);

export const addDebt = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/debt`, "POST", data, token);

export const addExpense = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/expense`, "POST", data, token);

export const addIncome = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/income`, "POST", data, token);
