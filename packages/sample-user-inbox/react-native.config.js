const path = require('path');

const packages = [
  'react-native-actito',
  'react-native-actito-push',
  'react-native-actito-push-ui',
  'react-native-actito-user-inbox',
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
