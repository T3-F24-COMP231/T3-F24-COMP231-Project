import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { apiRequest } from "@/utils";
import TransactionScreen from "@/app/(tabs)/transactions";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("mock-token")),
}));

jest.mock("@/hooks", () => ({
  useAuth: jest.fn(() => ({ currentUser: { _id: "user123" } })),
  useTheme: jest.fn(() => ({ theme: { purple: "#6200EE", text: "#000" } })),
}));

jest.mock("@/utils", () => ({
  apiRequest: jest.fn(),
}));

describe("TransactionScreen Component", () => {
  const mockTransactions = [
    {
      _id: "1",
      title: "Salary",
      type: "income",
      amount: 1000,
    },
    {
      _id: "2",
      title: "Groceries",
      type: "expense",
      amount: 200,
    },
    {
      _id: "3",
      title: "Loan Payment",
      type: "debt",
      amount: 500,
    },
  ];

  beforeEach(() => {
    (apiRequest as jest.Mock).mockResolvedValue(mockTransactions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Renders Loading Indicator
   * Description: Verifies that a loading indicator is displayed while fetching transactions.
   */
  it("displays a loading indicator while fetching transactions", () => {
    const { getByTestId } = render(<TransactionScreen />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  /**
   * Test: Renders Transactions
   * Description: Validates that fetched transactions are rendered correctly.
   */
  it("renders transactions correctly after fetching", async () => {
    const { getByText } = render(<TransactionScreen />);

    // Wait for transactions to load
    await waitFor(() => {
      expect(getByText("Salary")).toBeTruthy();
      expect(getByText("Groceries")).toBeTruthy();
      expect(getByText("Loan Payment")).toBeTruthy();
    });

    // Validate transaction amounts and types
    expect(getByText("+$1000.00")).toBeTruthy();
    expect(getByText("-$200.00")).toBeTruthy();
    expect(getByText("$500.00")).toBeTruthy();
  });

  /**
   * Test: Refresh Control
   * Description: Ensures that transactions are re-fetched when the user pulls to refresh.
   */
  it("refreshes transactions when pull-to-refresh is triggered", async () => {
    const { getByTestId } = render(<TransactionScreen />);

    const flatList = getByTestId("transaction-list");

    // Simulate pull-to-refresh
    fireEvent(flatList, "onRefresh");

    // Ensure `apiRequest` is called
    expect(apiRequest).toHaveBeenCalledWith(
      "/users/user123/transactions",
      "GET",
      undefined,
      "mock-token"
    );

    // Validate updated transactions
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Test: Empty State
   * Description: Displays an empty state message when no transactions are available.
   */
  it("displays an empty state message if no transactions are found", async () => {
    (apiRequest as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<TransactionScreen />);

    // Validate empty state
    await waitFor(() => {
      expect(getByText("No transactions found")).toBeTruthy();
    });
  });
});
