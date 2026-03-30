import api from "@/lib/axios";
import type { UserRole } from "@/types/auth.types";

// ── Types ────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  provider: "local" | "google" | "github";
  phone: string | null;
  skills: string[];
  expertise: string[];
  bio: string | null;
  companyName: string | null;
  companyEmail: string | null;
  profileCompletion: number;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ── API Calls ────────────────────────────────────────

/**
 * Register a new user
 */
export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};

/**
 * Login with email and password
 */
export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>("/auth/me");
  return data;
};

/**
 * Refresh access token (refresh token sent via httpOnly cookie)
 */
export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/refresh");
  return data;
};

/**
 * Logout current device
 */
export const logoutUser = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/logout");
  return data;
};

/**
 * Logout from all devices
 */
export const logoutAllDevices = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/logout-all");
  return data;
};

/**
 * Get Google OAuth URL
 */
export const getGoogleOAuthUrl = (role?: UserRole): string => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const roleParam = role ? `?role=${role}` : "";
  return `${baseUrl}/api/auth/google${roleParam}`;
};
