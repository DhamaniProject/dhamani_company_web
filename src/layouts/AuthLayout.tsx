// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

const AuthLayout: React.FC = () => {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-[var(--color-primary)] px-4 overflow-hidden"
      role="main"
      aria-label="Authentication page"
    >
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
