import eslint from 'eslint'

export default [
  {
    files: ['*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'no-unused-vars': ['warn'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'indent': ['error', 2],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'spaced-comment': ['error', 'always']
    }
  }
]
