import { apiClient } from "./client";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: UserProfile;
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface GetUserResponse {
  message: string;
  data: UserProfile;
}

/**
 * Get current authenticated user's profile
 * Requires JWT authentication
 * Returns null if unable to fetch
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const response = await apiClient.get<GetUserResponse>("/users/me");
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    // Return null instead of throwing
    return null;
  }
};

/**
 * Login with email and password
 * Returns user profile and JWT token
 */
export const login = async (
  email: string,
  password: string
): Promise<{ user: UserProfile; token: string } | null> => {
  try {
    const response = await apiClient.post<LoginResponse>("/users/login", {
      email,
      password,
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Register a new user account
 */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<UserProfile | null> => {
  try {
    const response = await apiClient.post<GetUserResponse>("/users/register", {
      name,
      email,
      password,
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

/**
 * Update current user's profile
 * Note: This endpoint may not exist yet in the backend
 * Check with your team if PUT /users/{id} is implemented
 */
export const updateUserProfile = async (
  userId: number,
  name?: string,
  phone?: string
): Promise<UserProfile | null> => {
  try {
    const response = await apiClient.put<GetUserResponse>(
      `/users/${userId}`,
      {
        name,
        phone,
      }
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

/**
 * Change password
 * Note: This endpoint may not exist yet in the backend
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    await apiClient.put("/users/password", {
      currentPassword,
      newPassword,
    });
    return true;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};
