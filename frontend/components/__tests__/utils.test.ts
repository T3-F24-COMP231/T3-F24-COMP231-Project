import { IUser } from "@/types";
import {
  apiRequest,
  CleanOutput,
  formatNumber,
  getToken,
  hasPermission,
  resolveRoute,
} from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

global.fetch = jest.fn();

describe("apiRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("makes a successful GET request", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { message: "Success" } }),
    });

    const result = await apiRequest("/test-endpoint", "GET");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test-endpoint"),
      expect.anything()
    );
    expect(result).toEqual({ message: "Success" });
  });

  test("throws an error on failed request", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(apiRequest("/test-endpoint", "GET")).rejects.toThrow(
      "API request failed with status 500"
    );
  });
});

describe("formatNumber", () => {
  test("formats billions", () => {
    expect(formatNumber(1000000000)).toBe("1.0B");
  });

  test("formats millions", () => {
    expect(formatNumber(2500000)).toBe("2.5M");
  });

  test("formats thousands", () => {
    expect(formatNumber(1500)).toBe("1.5K");
  });

  test("returns numbers below 1000 unchanged", () => {
    expect(formatNumber(500)).toBe("500");
  });
});

describe("CleanOutput", () => {
  test("formats numbers with commas", () => {
    expect(CleanOutput(1234567)).toBe("1,234,567");
  });

  test("keeps decimals intact", () => {
    expect(CleanOutput(1234.56)).toBe("1,234.56");
  });
});

describe("resolveRoute", () => {
  test("resolves a valid route", () => {
    expect(resolveRoute("income")).toBe("/(screens)/incomes/");
  });

  test("returns default route for unknown types", () => {
    expect(resolveRoute("unknown")).toBe("/");
  });
});

describe("hasPermission", () => {
  const user: IUser = {
    role: "Finance Tracker",
    _id: "6740169a79c8ff9e1fc7917d",
    name: "",
    email: "",
    password: "",
  };

  test("returns true for valid permission", () => {
    expect(hasPermission(user, "view:income")).toBe(true);
  });

  test("returns false for invalid permission", () => {
    expect(hasPermission(user, "delete:debts")).toBe(false);
  });
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

describe("getToken", () => {
  test("returns token if available", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("mock-token");

    const token = await getToken();
    expect(token).toBe("mock-token");
  });

  test("throws error if token is unavailable", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(getToken()).rejects.toThrow("Unauthorized");
  });
});
