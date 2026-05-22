import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AUTH_STORAGE_KEY } from '@/constants/auth';
import { authenticate } from '@/features/auth/fakeAuthService';
import type { AuthSession, User } from '@/features/auth/authTypes';

type AuthState = {
  user: User | null;
  token: string | null;
  isSubmitting: boolean;
  authError: string | null;
  hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isSubmitting: false,
      authError: null,
      hasHydrated: false,

      setHasHydrated: value => {
        set({ hasHydrated: value });
      },

      clearAuthError: () => {
        set({ authError: null });
      },

      login: async (email, password) => {
        set({ isSubmitting: true, authError: null });

        try {
          const session: AuthSession = await authenticate({ email, password });
          set({
            user: session.user,
            token: session.token,
            isSubmitting: false,
            authError: null,
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.';

          set({
            isSubmitting: false,
            authError: message,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          authError: null,
          isSubmitting: false,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.setHasHydrated(true);
          return;
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);

export function selectIsAuthenticated(state: AuthState): boolean {
  return state.user !== null && state.token !== null;
}
