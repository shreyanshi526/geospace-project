// useAuth.ts
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login, signup, logout, getCurrentUser, AuthResponse, LoginPayload, SignupPayload, AuthUser } from "@/api/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());

  // --- Mutations ---
  const loginMutation = useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user); // state update triggers re-render
      toast.success("Logged in successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const signupMutation = useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: signup,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Account created successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Signup failed");
    },
  });

  const logoutMutation = useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      toast.success("Logged out successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Logout failed");
    },
  });

  // --- Keep user in sync with localStorage ---
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
  };
}
