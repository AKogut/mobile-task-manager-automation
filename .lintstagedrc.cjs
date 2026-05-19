const path = require('path');

/** @type {import('lint-staged').Config} */
module.exports = {
  'app/**/*.{ts,tsx}': files => {
    const relativeFiles = files.map(file => path.relative('app', file));
    return [
      `cd app && cross-env ESLINT_USE_FLAT_CONFIG=false eslint -c .eslintrc.js --fix --max-warnings 0 ${relativeFiles.map(f => `"${f}"`).join(' ')}`,
      `prettier --write ${files.map(f => `"${f}"`).join(' ')}`,
    ];
  },
  'appium-tests/**/*.{ts,tsx}': files => [
    `eslint --config eslint.config.mjs --fix --max-warnings 0 ${files.map(f => `"${f}"`).join(' ')}`,
    `prettier --write ${files.map(f => `"${f}"`).join(' ')}`,
  ],
  '*.{json,md,yml,yaml}': 'prettier --write',
};
