import { DEMO_CREDENTIALS } from '@/constants/auth';
import {
  AuthError,
  type AuthSession,
  type LoginCredentials,
} from '@/features/auth/authTypes';

const NETWORK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function authenticate(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  await delay(NETWORK_DELAY_MS);

  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (
    email !== DEMO_CREDENTIALS.email ||
    password !== DEMO_CREDENTIALS.password
  ) {
    throw new AuthError('Invalid email or password. Please try again.');
  }

  return {
    user: {
      id: 'demo-user',
      email: DEMO_CREDENTIALS.email,
      name: 'Demo User',
    },
    token: 'demo-session-token',
  };
}
