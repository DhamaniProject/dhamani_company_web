import { useRoutes, Navigate } from "react-router-dom";
import ProfilePage from "../features/dashboard/profile/ProfilePage";
// Layouts
import AuthLayout from "../layouts/AuthLayout";
import CompanyDashboardLayout from "../layouts/CompanyDashboardLayout";
// Auth Pages
import LoginPage from "../features/auth/login/LoginPage";
import RegisterPage from "../features/auth/Register/RegisterPage";
// Dashboard Pages
import DashboardHomePage from "../features/dashboard/home/DashboardHomePage";
// Records Page
import RecordsPage from "../features/dashboard/records/RecordsPage";
// Products Page
import ProductsPage from "../features/dashboard/products/ProductsPage";
// Notifications Page
import NotificationsPage from "../features/dashboard/notifications/NotificationsPage";
// Reviews Page
import ReviewsPage from "../features/dashboard/reviews/ReviewsPage";
// Users Page
import UsersPage from "../features/dashboard/users/UsersPage";

import WarrantyProvidersPage from "../features/dashboard/warranty_providers/WarrantyProvidersPage";

import ForgotPasswordPage from "../features/auth/forgot-password/ForgotPasswordPage";

import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants/routes";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to={ROUTES.LOGIN} replace />,
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot-password", element: <ForgotPasswordPage /> },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <CompanyDashboardLayout />,
          children: [
            { path: "", element: <DashboardHomePage /> },
            { path: "profile", element: <ProfilePage /> },
            { path: "records", element: <RecordsPage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "notifications", element: <NotificationsPage /> },
            { path: "reviews", element: <ReviewsPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "warrantyProviders", element: <WarrantyProvidersPage /> },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default AppRoutes;
