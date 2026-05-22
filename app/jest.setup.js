/* eslint-env jest */

const mockAsyncStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    clear: jest.fn(async () => {
      mockAsyncStorage.clear();
    }),
    getItem: jest.fn(async key => mockAsyncStorage.get(key) ?? null),
    removeItem: jest.fn(async key => {
      mockAsyncStorage.delete(key);
    }),
    setItem: jest.fn(async (key, value) => {
      mockAsyncStorage.set(key, value);
    }),
  },
}));
