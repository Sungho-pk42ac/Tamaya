// @ts-check
// Tamaya frontend ESLint flat config (ESLint v10)
// React 18 + TypeScript + Vite. 도입 단계라 깨지기 쉬운 룰은 warn으로 둔다.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // 린트 대상에서 제외할 경로
  { ignores: ['dist', 'node_modules', 'vite.config.ts', 'eslint.config.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      // react-hooks: 버전별 configs 구조에 의존하지 않도록 룰을 직접 명시
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 새 jsx-runtime에서는 불필요
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // 한국어 UI 텍스트의 " ' 등은 정상 렌더되므로 escape 강제는 끈다
      'react/no-unescaped-entities': 'off',
      // 도입 단계 완화: error 대신 warn으로 두어 pre-commit을 막지 않는다
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // prettier와 충돌하는 포맷팅 룰 비활성화 (반드시 마지막)
  prettier,
);
