import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Replace '192.168.1.15' with your computer's actual local IP address (IPv4)
// If you are using an Android emulator on the same machine, you can sometimes use '10.0.2.2'
// If you are using an iOS simulator, 'localhost' or '127.0.0.1' might work
// But for Expo Go on a physical phone, you MUST use your local network IP!
export const BASE_URL = "http://13.212.23.160:4000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// "Kurir Sentral" Request Interceptor
// Attaches the JWT Token to every request automatically
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Ambil token dari brankas (SecureStore)
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        // Selipkan token di dalam amplop (Header Authorization)
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get token from SecureStore", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
