import { apiClient } from "./client";

export interface Asset {
  id: number;
  tickerSymbol: string;
  name: string;
  assetType: "Crypto" | "Stock" | "Mutual Fund" | "ETF" | "Gold" | "Currency";
  currentPrice: number;
  quantity: number;
  totalValue: number;
  avgBuyPrice?: number;
  pnlPercent?: number;
}

export interface GetAssetsResponse {
  message: string;
  data: Asset[];
}

export interface GetAssetPriceResponse {
  message: string;
  data: number;
}

/**
 * Fetch all assets from the backend
 * Requires JWT authentication
 * Returns empty array if none exist
 */
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const response = await apiClient.get<GetAssetsResponse>("/assets");
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Get the latest price for a ticker
 * Available tickers: BTC, ETH, BBCA, BBRI, ASII, etc.
 */
export const getAssetPrice = async (ticker: string): Promise<number> => {
  try {
    const response = await apiClient.get<GetAssetPriceResponse>(
      `/assets/quote/${ticker}`
    );
    return response.data?.data || 0;
  } catch (error) {
    console.error(`Failed to fetch price for ${ticker}:`, error);
    throw error;
  }
};

/**
 * Helper: Get assets grouped by type
 */
export const getAssetsByType = async (
  type: Asset["assetType"]
): Promise<Asset[]> => {
  const assets = await getAssets();
  return assets.filter((asset) => asset.assetType === type);
};

/**
 * Helper: Calculate total value of all assets
 */
export const calculateTotalAssetValue = async (): Promise<number> => {
  const assets = await getAssets();
  return assets.reduce((sum, asset) => sum + asset.totalValue, 0);
};
