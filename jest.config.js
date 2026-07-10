module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|react-native-.*|react-redux|redux|redux-thunk|reselect|immer|use-sync-external-store)/)',
  ],
};
