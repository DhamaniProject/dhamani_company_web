import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t, i18n } = useTranslation("dashboard");
  const isRtl = i18n.language === "ar";

  // Mock logged-in user data (replace with actual user data from auth context or API)
  const loggedInUser = {
    name: "Anas Alqunaid",
    companyLogo: "/dhamaniLogo2.svg", // Placeholder for customer's company logo
  };

  const navItemClass =
    "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors font-normal";

  const activeNavItemClass = "bg-[var(--color-primary)] text-white";

  const navItems = [
    {
      label: t("sidebar.dashboard"),
      to: "/dashboard",
      key: "dashboard",
      exact: true,
    },
    {
      label: t("sidebar.recordsManagement"),
      to: "/dashboard/records",
      key: "records",
      exact: true,
    },
    {
      label: t("sidebar.productsManagement"),
      to: "/dashboard/products",
      key: "products",
      exact: true,
    },
    {
      label: t("sidebar.notificationsManagement"),
      to: "/dashboard/notifications",
      key: "notifications",
      exact: true,
    },
    {
      label: t("sidebar.reviews"),
      to: "/dashboard/reviews",
      key: "reviews",
      exact: true,
    },
    {
      label: t("sidebar.userManagement"),
      to: "/dashboard/users",
      key: "users",
      exact: true,
    },
    {
      label: t("sidebar.companyProfile"),
      to: "/dashboard/profile",
      key: "profile",
    },
  ];

  return (
    <aside
      id="dashboard-sidebar"
      className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-64 fixed inset-y-0 start-0 z-50 bg-white border-e border-gray-200 lg:block lg:translate-x-0"
      aria-label={t("sidebar.dashboard")}
    >
      <div className="flex flex-col h-full max-h-full p-4">
        {/* Logo, Company Logo, and Username */}
        <div className="mb-6 flex flex-col items-center gap-3">
          {/* Dhamani Logo */}
          <img
            src="/dhamaniLogo.svg"
            alt="Dhamani logo"
            className="h-8 w-auto"
            aria-label="Dhamani logo"
          />
          {/* Company Logo */}
          <img
            src={loggedInUser.companyLogo}
            alt={`${loggedInUser.name}'s company logo`}
            className="h-10 w-10 rounded-full border border-gray-200 object-contain p-1"
            aria-label="Company logo"
          />
          {/* Username */}
          <div
            className="flex items-center gap-2"
            aria-label="Logged-in user"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-800">
              {loggedInUser.name}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-2" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `${navItemClass} ${isActive ? activeNavItemClass : ""}`
              }
              role="menuitem"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
