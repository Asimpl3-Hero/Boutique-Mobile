require('react-native-gesture-handler/jestSetup');

// Provides fake safe-area insets so providers/screens render under Jest.
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

// Native blur view isn't available under Jest — render a plain View.
jest.mock('@react-native-community/blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});

// Native env module isn't available under Jest — provide the test values.
jest.mock('react-native-config', () => ({
  API_URL: 'http://localhost:3000',
  PAYMENTS_PUBLIC_KEY: '',
  PAYMENTS_ACCEPTANCE_TOKEN: '',
}));
