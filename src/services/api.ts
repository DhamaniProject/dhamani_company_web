// src/services/api.ts
interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const api = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          credentials.email === "test@company.com" &&
          credentials.password === "password"
        ) {
          resolve({ data: { token: "mock-token" } });
        } else {
          resolve({ data: null as any, error: "errors.invalidCredentials" });
        }
      }, 1000);
    });
  },
};
