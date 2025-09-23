import http from "./axios";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

// --- Helpers ---
const saveAuthData = (data: AuthResponse) => {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// --- API Calls ---
export const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
  const data = await http.post<AuthResponse>("/users/signup", payload);
  if (data?.access_token) saveAuthData(data);
  return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const data = await http.post<AuthResponse>("/users/signin", payload);
  if (data?.access_token) saveAuthData(data);
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await http.post("/users/signout");
  } finally {
    clearAuthData();
  }
};

// --- Utility: get current user ---
export const getCurrentUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};
