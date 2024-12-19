import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptESLint from '@typescript-eslint/eslint-plugin';
import reactHooksESLint from 'eslint-plugin-react-hooks';
import reactESLint from 'eslint-plugin-react';
import prettierESLint from 'eslint-plugin-prettier';
import importESLint from 'eslint-plugin-import';
import { rules as emotionESLint } from '@emotion/eslint-plugin';
import prettierConfig from './prettier.config.js';

export default [
  {
    ignores: ['node_modules/', 'dist/'], // lint 적용 제외 경로
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': typescriptESLint,
      react: reactESLint,
      prettier: prettierESLint,
      import: importESLint,
      '@emotion': { rules: emotionESLint },
      'react-hooks': reactHooksESLint,
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': ['error', prettierConfig],

      'no-implicit-coercion': 'error',
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME', 'XXX', 'BUG'],
          location: 'anywhere',
        },
      ],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      '@emotion/pkg-renaming': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { format: ['camelCase', 'UPPER_CASE', 'PascalCase'], selector: 'variable', leadingUnderscore: 'allow' },
        { format: ['camelCase', 'PascalCase'], selector: 'function' },
        { format: ['PascalCase'], selector: 'interface' },
        { format: ['PascalCase'], selector: 'typeAlias' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'private-static-field',
            'public-instance-field',
            'private-instance-field',
            'public-constructor',
            'private-constructor',
            'public-instance-method',
            'private-instance-method',
          ],
        },
      ],

      // React-specific rules
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },
];
