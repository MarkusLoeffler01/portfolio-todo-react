

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // This will warn about stale closures in useEffect/useCallback
      "react-hooks/exhaustive-deps": "warn",
      // This prevents storing components in variables (related pattern)
      "react/jsx-no-constructed-context-values": "error",
    
      // This ensures you're not creating components inside components
      "react/no-unstable-nested-components": "error",
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["@mui/*/*/*"]
        }
      ]
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
)
