import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // ✅ SIGNUP
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // ✅ LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const user = response.data.user; // Get user object from the response
      
      // Ensure the role is included in the user object
      set({
        isAuthenticated: true,
        user, // Store the user including role
        error: null,
        isLoading: false,
      });
  
      return user; // Return user so we can navigate accordingly in the frontend
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  

  // ✅ LOGOUT
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // ✅ CHECK AUTH
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  // ✅ UPDATE PROFILE
  updateUser: async (updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/update-profile`, updatedData);
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating profile",
        isLoading: false,
      });
      throw error;
    }
  },

  // ✅ DELETE PROFILE
  deleteUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/delete-profile`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting profile",
        isLoading: false,
      });
      throw error;
    }
  },
}));
