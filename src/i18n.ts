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
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
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
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  })
  .then(() => {
    console.log("i18next initialized with language:", i18n.language);
  })
  .catch((err) => {
    console.error("i18next initialization failed:", err);
  });

export default i18n;
