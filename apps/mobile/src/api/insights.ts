import { apiClient } from "./client";

export interface Insight {
  id: number;
  type: "budget_alert" | "savings_milestone" | "investment_opportunity" | "expense_trend" | "goal_progress";
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: number;
  description?: string;
}

export interface GetInsightsResponse {
  message: string;
  data: Insight[];
}

export interface MarkInsightAsReadResponse {
  message: string;
  data: Insight;
}

/**
 * Fetch unread insights for the current user
 * Requires JWT authentication
 * Returns empty array if none exist
 */
export const getInsights = async (): Promise<Insight[]> => {
  try {
    const response = await apiClient.get<GetInsightsResponse>("/insights");
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Mark a specific insight as read
 * Updates the insight in the database
 */
export const markInsightAsRead = async (insightId: number): Promise<Insight> => {
  try {
    const response = await apiClient.patch<MarkInsightAsReadResponse>(
      `/insights/${insightId}/read`
    );
    return response.data?.data || ({} as Insight);
  } catch (error) {
    console.error(`Failed to mark insight ${insightId} as read:`, error);
    throw error;
  }
};

/**
 * Helper: Get only unread insights
 */
export const getUnreadInsights = async (): Promise<Insight[]> => {
  const insights = await getInsights();
  return insights.filter((insight) => !insight.isRead);
};

/**
 * Helper: Get unread count
 */
export const getUnreadInsightCount = async (): Promise<number> => {
  const unreadInsights = await getUnreadInsights();
  return unreadInsights.length;
};

/**
 * Helper: Get insights by type
 */
export const getInsightsByType = async (
  type: Insight["type"]
): Promise<Insight[]> => {
  const insights = await getInsights();
  return insights.filter((insight) => insight.type === type);
};
