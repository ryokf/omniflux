import * as SecureStore from "expo-secure-store";

/**
 * Decode JWT token and extract user_id (sub claim)
 * JWT format: header.payload.signature
 * We only need the payload which is Base64-encoded JSON
 */
export const decodeToken = (token: string): { sub?: number; [key: string]: any } | null => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if necessary (Base64 requires padding)
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    
    // Decode from Base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const claims = JSON.parse(decodedPayload);
    return claims;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Get current user ID from stored JWT token
 */
export const getUserIdFromToken = async (): Promise<number | null> => {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      return null;
    }

    const claims = decodeToken(token);
    return claims?.sub || null;
  } catch (error) {
    console.error("Failed to get user ID from token:", error);
    return null;
  }
};
