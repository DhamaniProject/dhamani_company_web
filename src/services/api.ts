import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Base API configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config); // Debug logging
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("API Response:", response); // Debug logging
    return response;
  },
  (error) => {
    console.error("Response Interceptor Error:", error.response || error);
    // Skip redirect for login endpoint
    const isLoginRequest =
      error.config?.url === "/api/v1/auth/company/login" &&
      error.config?.method === "post";
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(
      error.response?.data || { message: "An error occurred" }
    );
  }
);

export default api;
