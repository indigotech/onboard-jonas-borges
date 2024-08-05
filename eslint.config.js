import { readFileSync } from 'fs';
import { resolve } from 'path';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

const prettierConfigPath = resolve('./.prettierrc.json');
const prettierConfig = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', prettierConfig],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
