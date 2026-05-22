import { loginSchema } from '@/features/auth/loginSchema';

describe('loginSchema', () => {
  it('rejects an empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'Password123!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Email is required.',
      );
    }
  });

  it('rejects an invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Enter a valid email address.',
      );
    }
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'demo@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Password is required.',
      );
    }
  });

  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({
      email: 'demo@example.com',
      password: 'Password123!',
    });

    expect(result.success).toBe(true);
  });
});
