// features/auth/services/authService.ts

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  companyName: string;
  phone: string;
  email: string;
  password: string;
  // Add other fields
}

export const login = async (payload: LoginPayload) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const register = async (payload: RegisterPayload) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};
