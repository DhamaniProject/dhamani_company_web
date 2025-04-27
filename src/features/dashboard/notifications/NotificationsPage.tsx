import { useTranslation } from "react-i18next";
import NotificationsTable from "./components/NotificationsTable";

const NotificationsPage: React.FC = () => {
  const { t, i18n } = useTranslation("notifications");
  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("page.title")}
      >
        {t("page.title")}
      </h1>
      <NotificationsTable />
    </div>
  );
};

export default NotificationsPage;
