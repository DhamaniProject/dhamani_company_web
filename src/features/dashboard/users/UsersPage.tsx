import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UsersTable from "./components/UsersTable";
import AddUserModal from "./components/AddUserModal";
import UpdateUserModal from "./components/UpdateUserModal";

// Mock user data (replace with actual API call in the future)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "Active" | "Inactive";
}

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Ali",
    lastName: "Hassan",
    email: "ali.hassan@example.com",
    status: "Active",
  },
  {
    id: "2",
    firstName: "Fatima",
    lastName: "Youssef",
    email: "fatima.youssef@example.com",
    status: "Inactive",
  },
  {
    id: "3",
    firstName: "Khaled",
    lastName: "Mahmoud",
    email: "khaled.mahmoud@example.com",
    status: "Active",
  },
];

const UsersPage: React.FC = () => {
  const { t, i18n } = useTranslation("users");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching users (replace with actual API call)
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddUser = (newUser: Omit<User, "id" | "status">) => {
    // Simulate adding a user (replace with actual API call)
    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
      status: "Active", // Default status for new users
    };
    setUsers((prevUsers) => [...prevUsers, user]);
    setSuccessMessage("userAddedSuccess");
    setShowAddModal(false);
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
  };

  const handleUpdateUser = (updatedUser: Omit<User, "status">) => {
    // Simulate updating a user (replace with actual API call)
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id
          ? { ...user, ...updatedUser }
          : user
      )
    );
    setSuccessMessage("userUpdatedSuccess");
    setShowUpdateModal(false);
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <div
      className="p-6 max-w-full overflow-x-hidden"
      dir={i18n.language === "ar" ? "rtl" : undefined}
    >
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("page.title")}
      >
        {t("page.title")}
      </h1>
      {/* Success/Error Messages */}
      {successMessage && (
        <div
          className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium mb-4"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{t(successMessage)}</span>
        </div>
      )}
      {error && (
        <div
          className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium mb-4"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{t(error)}</span>
        </div>
      )}
      <UsersTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onAdd={() => setShowAddModal(true)}
      />
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}
      {showUpdateModal && selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UsersPage;