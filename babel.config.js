module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          store: './src/store',
          services: './src/services',
          utils: './src/utils',
          hooks: './src/hooks',
          modals: './src/modals',
          screen: './src/screen',
          components: './src/components',
        },
      },
    ],
  ],
};
