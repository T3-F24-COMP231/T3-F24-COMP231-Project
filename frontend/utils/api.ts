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

// Income Endpoints
export const fetchAllIncomes = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/incomes`, "GET", undefined, token);

export const addIncome = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/income`, "POST", data, token);

export const updateIncome = (userId: string, incomeId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/income/${incomeId}`, "PUT", data, token);

export const deleteIncome = (userId: string, incomeId: string, token: string) =>
  apiRequest(`/users/${userId}/income/${incomeId}`, "DELETE", undefined, token);

// Expense Endpoints
export const fetchAllExpenses = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/expenses`, "GET", undefined, token);

export const addExpense = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/expense`, "POST", data, token);

export const updateExpense = (userId: string, expenseId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/expense/${expenseId}`, "PUT", data, token);

export const deleteExpense = (userId: string, expenseId: string, token: string) =>
  apiRequest(`/users/${userId}/expense/${expenseId}`, "DELETE", undefined, token);

export const getExpenseSummary = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/expense/summary`, "GET", undefined, token);

// Debt Endpoints
export const fetchAllDebts = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/debts`, "GET", undefined, token);

export const addDebt = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/debt`, "POST", data, token);

export const updateDebt = (userId: string, debtId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/debt/${debtId}`, "PUT", data, token);

export const deleteDebt = (userId: string, debtId: string, token: string) =>
  apiRequest(`/users/${userId}/debt/${debtId}`, "DELETE", undefined, token);

// Investment Endpoints
export const fetchAllInvestments = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/investments`, "GET", undefined, token);

export const addInvestment = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/investments`, "POST", data, token);

export const getInvestmentById = (userId:string, investmentId: string, token: string) =>
  apiRequest(`/users/${userId}/investments/${investmentId}`, "GET", undefined, token);

export const updateInvestment = (userId: string, investmentId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/investments/${investmentId}`, "PUT", data, token);

export const deleteInvestment = (userId:string, investmentId: string, token: string) =>
  apiRequest(`/users/${userId}/investments/${investmentId}`, "DELETE", undefined, token);

// Savings Endpoints
export const fetchAllSavings = (userId: string, token: string) =>
  apiRequest(`/users/${userId}/savings`, "GET", undefined, token);

export const addSaving = (userId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/savings`, "POST", data, token);

export const updateSaving = (userId: string, savingId: string, data: object, token: string) =>
  apiRequest(`/users/${userId}/savings/${savingId}`, "PUT", data, token);

export const deleteSaving = (userId: string, savingId: string, token: string) =>
  apiRequest(`/users/${userId}/savings/${savingId}`, "DELETE", undefined, token);
