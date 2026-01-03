export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/test/**/*.spec.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/generated/**'],
  coverageDirectory: 'coverage',
  verbose: true,
  globalSetup: './test/setup.js',
  globalTeardown: './test/teardown.js',
  forceExit: true, // Forzar salida después de los tests
  detectOpenHandles: true, // Detectar handles abiertos
};
