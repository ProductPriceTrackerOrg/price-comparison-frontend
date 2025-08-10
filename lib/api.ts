import axios from "axios";
import { supabase } from "./supabase";

// Create an axios instance with the base URL of your FastAPI backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
