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

// Keystore-backed storage isn't available under Jest — in-memory fake.
jest.mock('react-native-keychain', () => {
  const vault = new Map();
  return {
    setGenericPassword: jest.fn(async (username, password, options) => {
      vault.set(options?.service ?? 'default', { username, password });
      return { service: options?.service ?? 'default', storage: 'mock' };
    }),
    getGenericPassword: jest.fn(async options => {
      return vault.get(options?.service ?? 'default') ?? false;
    }),
  };
});

// Native video player isn't available under Jest — render a plain View.
jest.mock('react-native-video', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

// Native env module isn't available under Jest — provide the test values.
jest.mock('react-native-config', () => ({
  API_URL: 'http://localhost:3000',
  PAYMENTS_PUBLIC_KEY: '',
  PAYMENTS_ACCEPTANCE_TOKEN: '',
}));
