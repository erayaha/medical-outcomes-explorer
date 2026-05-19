import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.js',
    'components/**/*.js',
    'lib/**/*.js',
    '!app/**/[[]*[]]/**/*.js',
    '!app/sitemap.js',
    '!app/robots.js',
  ],
};

export default createJestConfig(customJestConfig);
