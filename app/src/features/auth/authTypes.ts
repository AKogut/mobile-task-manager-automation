export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  user: User;
  token: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
