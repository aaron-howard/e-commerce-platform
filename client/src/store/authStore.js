import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Set token in axios headers
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Remove token from axios headers
        delete api.defaults.headers.common['Authorization'];
      },

      setLoading: (isLoading) => set({ isLoading }),

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          // Set token in headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/auth/me');
          set({ 
            user: response.data, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          get().setAuth(user, token);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;
          
          get().setAuth(user, token);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      logout: () => {
        get().clearAuth();
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/users/profile', profileData);
          set({ 
            user: { ...get().user, ...response.data }, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Profile update failed' 
          };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          await api.put('/users/change-password', { currentPassword, newPassword });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Password change failed' 
          };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export { useAuthStore };
