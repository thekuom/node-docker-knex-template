module.exports = {
  extends: ['../.base-eslintrc.js'],
  parserOptions: {
    project: './test/tsconfig.json'
  },
  rules: {
    'no-unused-expressions': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  }
}
