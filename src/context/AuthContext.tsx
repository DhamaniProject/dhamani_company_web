import React, { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCurrentUser } from "../features/auth/login/services/loginAuthService";
import { User } from "../features/auth/login/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!localStorage.getItem("access_token") && !isSubmitting,
    retry: false,
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      console.log("AuthContext onError:", error); // Debug log
      if (error.code === "UNAUTHORIZED" && !isSubmitting) {
        if (window.location.pathname !== "/auth/login") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          sessionStorage.removeItem("refresh_token");
          toast.error("Session expired. Please log in again.");
          window.location.href = "/auth/login";
        } else {
          console.log("Skipping redirect, already on login page");
        }
      } else if (!isSubmitting) {
        toast.error("Failed to fetch user data.");
      }
    },
  });

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      refetchUser: refetch,
      isSubmitting,
      setIsSubmitting,
    }),
    [user, isLoading, refetch, isSubmitting]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
