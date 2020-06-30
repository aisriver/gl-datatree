module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
  rules: {
    complexity: ['warn', { max: 6 }],
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/camelcase': 'off',
    'import/prefer-default-export': 'off',
    'import/no-commonjs': 'off',
  },
  overrides: [
    {
      files: '*.d.ts',
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
