const path = require('path');

// Aliased packages
const packages = [
  'react-native-actito',
  // 'react-native-actito-assets',
  // 'react-native-actito-geo',
  // 'react-native-actito-in-app-messaging',
  // 'react-native-actito-inbox',
  // 'react-native-actito-loyalty',
  // 'react-native-actito-push',
  // 'react-native-actito-push-ui',
  // 'react-native-actito-scannables',
].map((name) => require(path.resolve(__dirname, '..', name, 'package.json')));

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: packages.reduce((acc, p) => {
          acc[p.name] = path.join(__dirname, '..', p.name, p.source);
          return acc;
        }, {}),
      },
    ],
    ['module:react-native-dotenv'],
  ],
};
