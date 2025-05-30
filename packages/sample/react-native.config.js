const path = require('path');

const packages = [
  'react-native-actito',
  'react-native-actito-assets',
  'react-native-actito-geo',
  // 'react-native-actito-in-app-messaging',
  // 'react-native-actito-inbox',
  // 'react-native-actito-loyalty',
  // 'react-native-actito-push',
  // 'react-native-actito-push-ui',
  // 'react-native-actito-scannables',
];

const dependencies = packages.reduce((deps, packageName) => {
  deps[packageName] = {
    root: path.join(__dirname, '..', packageName),
  };
  return deps;
}, {});

module.exports = {
  dependencies,
};
