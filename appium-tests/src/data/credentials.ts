export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'Password123!',
  name: 'Demo User',
} as const;

export type DemoCredentials = typeof DEMO_CREDENTIALS;
