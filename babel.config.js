module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@lib': './src/lib',
          '@store': './src/store',
          '@theme': './src/theme',
          '@components': './src/components',
          '@screens': './src/screens',
          '@': './src',
        },
      },
    ],
  ],
};
