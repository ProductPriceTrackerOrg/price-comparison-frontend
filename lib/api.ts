import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { supabase } from "./supabase";
import axiosRetry from "axios-retry";

// Create an axios instance with the base URL of your FastAPI backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
  timeout: 15000, // 15 seconds timeout (increased from 10s)
  maxContentLength: 5 * 1024 * 1024, // 5MB max content size
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure axios-retry
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay, // exponential backoff
  retryCondition: (error: AxiosError): boolean => {
    // Retry on network errors or 5xx errors
    return Boolean(
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response && error.response.status >= 500)
    );
  },
  onRetry: (
    retryCount: number,
    error: AxiosError,
    requestConfig: AxiosRequestConfig
  ) => {
    console.log(
      `Retry attempt ${retryCount} for ${requestConfig.url} due to: ${error.message}`
    );
  },
});

// Use an interceptor to automatically add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    // Get the latest session from Supabase
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    // If a session exists, add the Authorization header
    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
