import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE_KEY, DEMO_CREDENTIALS } from '@/constants/auth';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/authStore';

const initialAuthState = {
  user: null,
  token: null,
  isSubmitting: false,
  authError: null,
  hasHydrated: true,
};

async function waitForPersistedState(): Promise<void> {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined);
    }, 0);
  });
}

describe('authStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState(initialAuthState);
  });

  it('logs in with valid credentials and marks the user authenticated', async () => {
    await useAuthStore
      .getState()
      .login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    const state = useAuthStore.getState();
    expect(state.user?.email).toBe(DEMO_CREDENTIALS.email);
    expect(state.token).toBe('demo-session-token');
    expect(state.authError).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('stores a readable auth error for invalid credentials', async () => {
    await useAuthStore
      .getState()
      .login(DEMO_CREDENTIALS.email, 'wrong-password');

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.authError).toBe(
      'Invalid email or password. Please try again.',
    );
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('clears the current session on logout', async () => {
    await useAuthStore
      .getState()
      .login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.authError).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('persists only the session fields needed for restore', async () => {
    await useAuthStore
      .getState()
      .login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    await waitForPersistedState();

    const persistedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

    expect(persistedState).toContain(DEMO_CREDENTIALS.email);
    expect(persistedState).toContain('demo-session-token');
    expect(persistedState).not.toContain('isSubmitting');
    expect(persistedState).not.toContain('authError');
  });
});
