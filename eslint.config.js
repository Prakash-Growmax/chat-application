import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier, // Add Prettier plugin
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }], // Disallow console.log but allow console.warn & console.error
      ...tseslint.configs.recommended.rules, // Keep other recommended rules
      'prettier/prettier': 'error', // Enforce Prettier formatting as ESLint errors
    },
  },
  eslintConfigPrettier, // Disable conflicting ESLint rules with Prettier
];
