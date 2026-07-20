import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage', '.turbo', 'prisma/migrations'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  eslintConfigPrettier,

  {
    files: ['**/*.ts'],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        project: './tsconfig.json',
      },

      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Variáveis não utilizadas
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Preferir interfaces
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Evitar any
      '@typescript-eslint/no-explicit-any': 'warn',

      // Preferir const
      'prefer-const': 'error',

      // Evitar var
      'no-var': 'error',

      // === DESATIVADAS ===

      'no-console': 'off',
    },
  },
);
