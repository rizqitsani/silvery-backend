export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '@/(.+)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: true,
};
