module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'feat', // New feature
        'fix', // Fix error or bug
        'improve', // Improve code
        'refactor', // Restructure code
        'docs', // Add document
        'chore', // Small change in develop
        'style', // Format style but not affect logic
        'test', // Write test
        'revert', // Revert commit
        'ci', // Config CI/CD
        'build', // Build
      ],
    ],
    'type-case': [1, 'always', 'lower-case'],
    'type-empty': [1, 'never'],
    'scope-empty': [1, 'never'],
    'subject-empty': [1, 'never'],
    'subject-full-stop': [1, 'never', '.'],
    'header-max-length': [1, 'always', 72],
  },
};
