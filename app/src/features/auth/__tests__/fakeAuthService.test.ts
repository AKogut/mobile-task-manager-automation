import { DEMO_CREDENTIALS } from '@/constants/auth';
import { AuthError } from '@/features/auth/authTypes';
import { authenticate } from '@/features/auth/fakeAuthService';

describe('fakeAuthService', () => {
  it('returns a session for valid demo credentials', async () => {
    const session = await authenticate({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    });

    expect(session).toEqual({
      user: {
        id: 'demo-user',
        email: DEMO_CREDENTIALS.email,
        name: 'Demo User',
      },
      token: 'demo-session-token',
    });
  });

  it('normalizes email casing and whitespace before authentication', async () => {
    const session = await authenticate({
      email: '  DEMO@EXAMPLE.COM  ',
      password: DEMO_CREDENTIALS.password,
    });

    expect(session.user.email).toBe(DEMO_CREDENTIALS.email);
  });

  it('throws a readable auth error for invalid credentials', async () => {
    await expect(
      authenticate({
        email: DEMO_CREDENTIALS.email,
        password: 'wrong-password',
      }),
    ).rejects.toThrow(AuthError);
  });
});
