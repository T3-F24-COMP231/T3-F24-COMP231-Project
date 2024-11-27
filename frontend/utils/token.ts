import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async (): Promise<string | undefined> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token || token === undefined) {
      throw new Error("Unauthorized");
    }
    return token;
  } catch (error) {
    throw new Error("Error fetching token")
  }
};
