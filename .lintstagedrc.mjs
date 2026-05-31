/** @type {import("lint-staged").Configuration} */
export default {
  'apps/web/**/*.{ts,tsx,js,jsx,mjs,cjs}': [
    'eslint --fix --no-warn-ignored',
    'prettier --write',
  ],
  'apps/api/**/*.{ts,js,mjs,cjs}': 'prettier --write',
  '*.{js,mjs,cjs,ts}': 'prettier --write',
  '**/*.{json,md,yml,yaml,css,scss}': 'prettier --write',
};
