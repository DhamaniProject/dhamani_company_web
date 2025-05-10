// src/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLogin from "./locales/en/login.json";
import arLogin from "./locales/ar/login.json";
import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import enRegister from "./locales/en/register.json";
import arRegister from "./locales/ar/register.json";
import enDashboard from "./locales/en/dashboard.json";
import arDashboard from "./locales/ar/dashboard.json";
import enProfile from "./locales/en/profile.json";
import arProfile from "./locales/ar/profile.json";
import enRecords from "./locales/en/records.json";
import arRecords from "./locales/ar/records.json";
import enProducts from "./locales/en/products.json";
import arProducts from "./locales/ar/products.json";
import enNotifications from "./locales/en/notifications.json";
import arNotifications from "./locales/ar/notifications.json";
import enReviews from "./locales/en/Reviews.json";
import arReviews from "./locales/ar/Reviews.json";
import enUsers from "./locales/en/users.json";
import arUsers from "./locales/ar/users.json";
import enWarranty from "./locales/en/warranty_providers.json";
import arWarranty from "./locales/ar/warranty_providers.json";

const resources = {
  en: {
    login: enLogin,
    common: enCommon,
    register: enRegister,
    dashboard: enDashboard,
    profile: enProfile,
    records: enRecords,
    products: enProducts,
    notifications: enNotifications,
    reviews: enReviews,
    users: enUsers,
    warrantyProviders: enWarranty,
  },
  ar: {
    login: arLogin,
    common: arCommon,
    register: arRegister,
    dashboard: arDashboard,
    profile: arProfile,
    records: arRecords,
    products: arProducts,
    notifications: arNotifications,
    reviews: arReviews,
    users: arUsers,
    warrantyProviders: arWarranty,
  },
};

// Get the stored language from localStorage or default to 'en'
const storedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage, // Use the stored language instead of hardcoded 'en'
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    ns: [
      "login",
      "common",
      "register",
      "dashboard",
      "profile",
      "records",
      "products",
      "notifications",
      "reviews",
      "users",
      "warrantyProviders",
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  })
  .then(() => {
    console.log("i18next initialized with language:", i18n.language);
    console.log("Available namespaces:", i18n.options.ns);
    console.log(
      "Records namespace (en):",
      i18n.getResourceBundle("en", "records")
    );
    console.log(
      "Records namespace (ar):",
      i18n.getResourceBundle("ar", "records")
    );
  })
  .catch((err) => {
    console.error("i18next initialization failed:", err);
  });

// Add a function to change language that also updates localStorage
export const changeLanguage = (language: string) => {
  localStorage.setItem('language', language);
  i18n.changeLanguage(language);
};

export default i18n;
