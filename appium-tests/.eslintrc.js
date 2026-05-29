module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    mocha: true,
    es2022: true,
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
