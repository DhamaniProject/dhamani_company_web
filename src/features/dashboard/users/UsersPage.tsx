import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UsersTable from "./components/UsersTable";
import AddUserModal from "./components/AddUserModal";
import UpdateUserModal from "./components/UpdateUserModal";
import { useUsers } from "./hooks/useUsers";
import { User } from "./types/types";
import { updateUser, createUser } from "./services/userService";
import { useAuth } from "../../../context/AuthContext";

const UsersPage: React.FC = () => {
  const { t, i18n } = useTranslation("users");
  const {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchUsers,
  } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();

  const handleAddUser = async (
    newUser: Omit<User, "id" | "status"> & { password: string }
  ) => {
    if (!user?.company_id) {
      setErrorMessage("noCompanyId");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      const requestBody = {
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        email: newUser.email,
        company_id: user.company_id,
        password: newUser.password,
      };
      await createUser(requestBody);
      setSuccessMessage("userAddedSuccess");
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchUsers(); // Refresh users after adding
    } catch (error: any) {
      setErrorMessage(error.message || "createUserError");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (!user?.company_id) {
      setErrorMessage("noCompanyId");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      const requestBody: any = {};
      if (updatedUser.firstName !== selectedUser?.firstName)
        requestBody.first_name = updatedUser.firstName;
      if (updatedUser.lastName !== selectedUser?.lastName)
        requestBody.last_name = updatedUser.lastName;
      if (updatedUser.email !== selectedUser?.email)
        requestBody.email = updatedUser.email;
      if (updatedUser.status !== selectedUser?.status)
        requestBody.status =
          updatedUser.status === "Active" ? "active" : "inactive";

      await updateUser(user.company_id, updatedUser.id, requestBody);
      setSuccessMessage("userUpdatedSuccess");
      setShowUpdateModal(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchUsers(); // Refresh users after updating
    } catch (error: any) {
      setErrorMessage(error.message || "updateUserError");
      setTimeout(() => setErrorMessage(null), 3000);
    }
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
      {(error || errorMessage) && (
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
          <span>{t(`errors.${error || errorMessage}`)}</span>
        </div>
      )}
      <UsersTable
        users={users}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
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
