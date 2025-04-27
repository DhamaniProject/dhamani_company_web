import { Outlet } from "react-router-dom";
import Sidebar from "../features/dashboard/common/Sidebar";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const CompanyDashboardLayout: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col ${isRtl ? "lg:mr-64" : "lg:ml-64"}`}
      >
        <header
          className="bg-white shadow-sm p-4 flex justify-end items-center"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <LanguageSwitcher />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboardLayout;
