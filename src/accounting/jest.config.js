export default {
  testEnvironment: 'node',
  transform: {},
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  testMatch: ['**/*.test.js'],
  verbose: true
};
