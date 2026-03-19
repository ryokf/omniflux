import { apiClient } from "./client";

export interface Portfolio {
  id: number;
  userId: number;
  name: string;
  description?: string;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface NetWorthResponse {
  totalNetWorth: number;
  cashTotal: number;
  investmentTotal: number;
  breakdown?: {
    crypto: number;
    stocks: number;
    mutualFunds: number;
    gold: number;
    currency: number;
  };
}

export interface GetPortfoliosResponse {
  message: string;
  data: Portfolio[];
}

export interface GetNetWorthResponse {
  message: string;
  data: NetWorthResponse;
}

/**
 * Get current user's net worth breakdown
 * Requires JWT authentication
 * Returns zero values if data unavailable
 */
export const getNetWorth = async (): Promise<NetWorthResponse> => {
  try {
    const response = await apiClient.get<GetNetWorthResponse>(
      "/portfolios/net-worth"
    );
    return response.data?.data || {
      totalNetWorth: 0,
      cashTotal: 0,
      investmentTotal: 0,
    };
  } catch (error) {
    console.error("Failed to fetch net worth:", error);
    // Return zero values instead of throwing
    return {
      totalNetWorth: 0,
      cashTotal: 0,
      investmentTotal: 0,
    };
  }
};

/**
 * Get all portfolios for a specific user
 * Requires JWT authentication
 */
export const getPortfoliosByUserId = async (userId: number): Promise<Portfolio[]> => {
  try {
    const response = await apiClient.get<GetPortfoliosResponse>(
      `/portfolios/user/${userId}`
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch portfolios:", error);
    throw error;
  }
};

/**
 * Get a single portfolio by ID
 * Requires JWT authentication
 */
export const getPortfolioById = async (portfolioId: number): Promise<Portfolio | null> => {
  try {
    const response = await apiClient.get<{ message: string; data: Portfolio }>(
      `/portfolios/${portfolioId}`
    );
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch portfolio ${portfolioId}:`, error);
    return null;
  }
};

/**
 * Create a new portfolio
 * Requires JWT authentication
 */
export const createPortfolio = async (
  name: string,
  userId: number,
  description?: string
): Promise<Portfolio | null> => {
  try {
    const response = await apiClient.post<{ message: string; data: Portfolio }>(
      "/portfolios",
      {
        name,
        userId,
        description,
      }
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to create portfolio:", error);
    throw error;
  }
};

/**
 * Update an existing portfolio
 * Requires JWT authentication
 */
export const updatePortfolio = async (
  portfolioId: number,
  name?: string,
  description?: string
): Promise<Portfolio | null> => {
  try {
    const response = await apiClient.put<{ message: string; data: Portfolio }>(
      `/portfolios/${portfolioId}`,
      {
        name,
        description,
      }
    );
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to update portfolio ${portfolioId}:`, error);
    throw error;
  }
};

/**
 * Delete a portfolio
 * Requires JWT authentication
 */
export const deletePortfolio = async (portfolioId: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/portfolios/${portfolioId}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete portfolio ${portfolioId}:`, error);
    return false;
  }
};
