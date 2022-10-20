/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    'node_modules/strtok3/.+\\.(j|t)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!strtok3/.*)'
  ]
};
