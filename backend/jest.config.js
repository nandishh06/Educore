module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/__tests__/**/*.js', '**/?(*.)+(spec|test).ts', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testTimeout: 10000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.git/',
    '<rootDir>/.vscode/',
    '<rootDir>/.windsurf/',
    '<rootDir>/.trae/',
    '<rootDir>/Library/',
    '<rootDir>/Applications/',
    '<rootDir>/.nvm/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.vscode/',
    '<rootDir>/.windsurf/',
    '<rootDir>/.trae/',
    '<rootDir>/Library/',
    '<rootDir>/Applications/',
    '<rootDir>/.nvm/',
  ],
}
