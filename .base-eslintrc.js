module.exports = {
  env: {
    node: true,
    es6: true
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: ['@dialexa/eslint-config-dialexa/node-es6', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    // maybe enable this again when https://github.com/typescript-eslint/typescript-eslint/issues/1824 is resolved
    // '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': [2, {
      allowExpressions: true,
      allowTypedFunctionExpressions: true
    }],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': ['error', {
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_",
    }],
    'import/no-default-export': 2,
    'import/order': [2, {
      alphabetize: { order: 'asc' },
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      pathGroups: [{
        pattern: 'src/**',
        group: 'internal',
      }, {
        pattern: 'test/**',
        group: 'internal',
        position: 'after',
      }],
      pathGroupsExcludedImportTypes: ['builtin'],
      'newlines-between': 'always',
    }],
    'no-console': 2,
    'semi': 2,
    'no-multiple-empty-lines': [2, {
      max: 1,
      maxEOF: 0,
      maxBOF: 0
    }],
    'no-multi-spaces': 2,
    'quotes': [2, 'single', { avoidEscape: true }],
    'prefer-arrow-callback': 2,
    '@typescript-eslint/explicit-member-accessibility': [2, {
      overrides: {
        constructors: 'no-public'
      }
    }],
    '@typescript-eslint/no-parameter-properties': 0,
    'newline-before-return': 2,
    'quote-props': [2, 'as-needed'],
    '@typescript-eslint/no-empty-interface': 0,
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-spacing': [2, {'before': false, 'after': true}],
    'comma-dangle': [2, 'always-multiline'],
    'prefer-const': [2, {
      'destructuring': 'all',
    }],
    'space-in-parens': [2, 'never'],
    'object-curly-spacing': [2, 'always'],
    'array-bracket-spacing': [2, 'never'],
  }
}
