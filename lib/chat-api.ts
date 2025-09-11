import axios from "axios";
import { supabase } from "./supabase";

// Create an axios instance specifically for the chat backend
const chatApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://127.0.0.1:8001",
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
