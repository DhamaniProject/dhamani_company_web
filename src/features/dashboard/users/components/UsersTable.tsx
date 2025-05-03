import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { User } from "../types/types";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onAdd: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onAdd,
}) => {
  const { t, i18n } = useTranslation("users");
  const { t: tCommon } = useTranslation("common");

  const paginationText = `${t("pagination.pageStart")} ${currentPage + 1} ${t(
    "pagination.pageMiddle"
  )} ${totalPages}`;

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
            {/* Header */}
            <div className="px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200 gap-4 flex-nowrap">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {t("table.title")}
              </h2>
              <div>
                <Button
                  onClick={onAdd}
                  disabled={isLoading}
                  className="w-24 py-1 px-2 text-xs font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] whitespace-nowrap truncate min-w-fit"
                  aria-label={t("table.addUser")}
                >
                  {t("table.addUser")}
                </Button>
              </div>
            </div>
            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.fullName")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.email")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.status")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => onEdit(user)}
                      className="cursor-pointer hover:bg-gray-50"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onEdit(user);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {`${user.firstName} ${user.lastName}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-normal ${
                            user.status === "Active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {t(`table.status_${user.status.toLowerCase()}`)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {isLoading ? tCommon("loading") : t("table.noUsers")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <p className="text-sm text-gray-600">{paginationText}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isLoading}
                    className="py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover"
                    aria-label={t("pagination.previous")}
                  >
                    {t("pagination.previous")}
                  </Button>
                  <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1 || isLoading}
                    className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                    aria-label={t("pagination.next")}
                  >
                    {t("pagination.next")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
