import { apiClient } from "./client";
import { getUserIdFromToken } from "./auth";

export interface Wallet {
  id: number;
  userId: number;
  name: string;
  balance: number;
  currency?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetWalletsResponse {
  message: string;
  data: Wallet[];
}

export interface GetWalletResponse {
  message: string;
  data: Wallet;
}

/**
 * Get all wallets for the current user
 * Requires JWT authentication
 * Uses user_id from JWT token to fetch wallets
 */
export const getWallets = async (): Promise<Wallet[]> => {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      console.warn("User ID not found in token - no wallets loaded");
      return [];
    }
    
    const response = await apiClient.get<GetWalletsResponse>(`/wallets/${userId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
    // Return empty array instead of throwing to avoid breaking UI
    return [];
  }
};

/**
 * Get a specific wallet by ID
 * Requires JWT authentication
 */
export const getWalletById = async (walletId: number): Promise<Wallet | null> => {
  try {
    const response = await apiClient.get<GetWalletResponse>(
      `/wallets/${walletId}`
    );
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch wallet ${walletId}:`, error);
    return null;
  }
};

/**
 * Create a new wallet
 * Requires JWT authentication
 */
export const createWallet = async (
  name: string,
  balance: number,
  currency?: string
): Promise<Wallet | null> => {
  try {
    const response = await apiClient.post<GetWalletResponse>("/wallets", {
      name,
      balance,
      currency,
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to create wallet:", error);
    throw error;
  }
};

/**
 * Update a wallet
 * Requires JWT authentication
 */
export const updateWallet = async (
  walletId: number,
  name?: string,
  balance?: number,
  currency?: string
): Promise<Wallet | null> => {
  try {
    const response = await apiClient.put<GetWalletResponse>(
      `/wallets/${walletId}`,
      {
        name,
        balance,
        currency,
      }
    );
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to update wallet ${walletId}:`, error);
    throw error;
  }
};

/**
 * Delete a wallet
 * Requires JWT authentication
 */
export const deleteWallet = async (walletId: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/wallets/${walletId}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete wallet ${walletId}:`, error);
    return false;
  }
};

/**
 * Helper: Calculate total balance across all wallets
 */
export const calculateTotalBalance = async (): Promise<number> => {
  const wallets = await getWallets();
  return wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
};
