import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'node_modules/**',
      'allure-results/**',
      'allure-report/**',
      'coverage/**',
      'reports/**',
      'test-results/**'
    ]
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
        ...globals.mocha,

        browser: 'readonly',
        driver: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',

        Given: 'readonly',
        When: 'readonly',
        Then: 'readonly',
        Before: 'readonly',
        After: 'readonly'
      }
    }
  }
]
