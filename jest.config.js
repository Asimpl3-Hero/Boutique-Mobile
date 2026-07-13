module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Barrel re-exports and type-only modules have no runtime behavior to test.
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/.*/index\\.ts$',
    '/src/.*/types\\.ts$',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|react-native-.*|react-redux|redux|redux-thunk|reselect|immer|use-sync-external-store)/)',
  ],
};
