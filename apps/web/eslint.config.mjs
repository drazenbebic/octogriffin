import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierRecommended,
  {
    settings: {
      react: {
        version: '19',
      },
    },
    plugins: {
      'unused-imports': pluginUnusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          endOfLine: 'auto',
          arrowParens: 'avoid',
          trailingComma: 'all',
          semi: true,
          singleQuote: true,
          useTabs: false,
          bracketSpacing: true,
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Side effect imports (e.g. import 'style.css')
            ['^\\u0000'],
            // 2. React, Next.js, and other node built-ins
            ['^react', '^next', '^node:'],
            // 3. Third-party packages (starting with a letter or @)
            ['^@?\\w'],
            // 4. Internal imports (using your @/ alias)
            ['^@/'],
            // 5. Relative imports (starting with .)
            ['^\\.'],
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/**',
  ]),
]);

export default eslintConfig;
