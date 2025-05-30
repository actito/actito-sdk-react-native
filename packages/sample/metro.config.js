const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');

// Aliased packages
const packages = [
  'react-native-actito',
  'react-native-actito-assets',
  'react-native-actito-geo',
  'react-native-actito-in-app-messaging',
  // 'react-native-actito-inbox',
  // 'react-native-actito-loyalty',
  'react-native-actito-push',
  // 'react-native-actito-push-ui',
  // 'react-native-actito-scannables',
].map((name) => require(path.resolve(__dirname, '..', name, 'package.json')));

// An array with the unique names of peer dependencies.
const peerDependencies = [
  ...new Set([
    ...packages.flatMap((p) => Object.keys(p.peerDependencies)),
  ]),
];

const config = {
  projectRoot: __dirname,
  watchFolders: [
    path.resolve(__dirname),
    ...packages.map((p) => path.resolve(__dirname, '..', p.name)),
    path.resolve(__dirname, '../../'),
  ],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blacklist them at the root, and alias them to the versions in sample's node_modules
  resolver: {
    blacklistRE: blacklist(
      packages.flatMap((p) => {
        return peerDependencies.map((d) => {
          return new RegExp(`^${escape(path.join(__dirname, '..', p.name, 'node_modules', d))}\\/.*$`);
        });
      }),
    ),

    extraNodeModules: peerDependencies.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
