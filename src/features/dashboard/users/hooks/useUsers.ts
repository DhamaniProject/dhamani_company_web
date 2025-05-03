import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { fetchUsers } from "../services/userService";
import { User } from "../types/types";

interface UseUsers {
  users: User[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  fetchUsers: () => void;
}

export const useUsers = (context: string = "page"): UseUsers => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, refetch } = useQuery({
    queryKey: ["users", context, user?.company_id, currentPage],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error("noCompanyId");
      }
      const response = await fetchUsers(user.company_id, currentPage + 1, 10);
      const mappedUsers: User[] = response.data.map((item) => ({
        id: item.user_id,
        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email,
        status: item.status === "active" ? "Active" : "Inactive",
      }));
      setUsers(mappedUsers);
      setTotalPages(response.total_pages || 1);
      setError(null);
      return response;
    },
    enabled: !!user?.company_id,
    retry: 1,
  });

  const handleFetchUsers = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchUsers: handleFetchUsers,
  };
};
