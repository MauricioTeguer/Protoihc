import Constants from "expo-constants";
import { Platform } from "react-native";

const manifestApiUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;

export const API_URL =
  manifestApiUrl ??
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");
