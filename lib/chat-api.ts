import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { supabase } from "./supabase";
import axiosRetry from "axios-retry";

// Create an axios instance specifically for the chat backend
const chatApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://127.0.0.1:8001",
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure axios-retry
axiosRetry(chatApi, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
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
      `Chat API retry attempt ${retryCount} for ${requestConfig.url} due to: ${error.message}`
    );
  },
});

// Use an interceptor to automatically add the auth token to every request
chatApi.interceptors.request.use(
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

export default chatApi;
