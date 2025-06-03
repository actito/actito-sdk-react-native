import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Sample Expo',
  slug: 'sample-expo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'com.actito.sample.app.dev',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  primaryColor: '#00000000',
  androidStatusBar: {
    backgroundColor: '#00000000',
  },
  ios: {
    bundleIdentifier: 'com.actito.sample.app.dev',
    associatedDomains: [
      `applinks:${process.env.NOTIFICARE_APP_ID}.applinks.notifica.re`,
      `applinks:actito-sample-app-dev.ntc.re`,
    ],
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription:
        "We will need access to the device's camera to reply to notifications",
      NSPhotoLibraryUsageDescription:
        'We will need access to your photos to reply to notifications',
      NSLocationWhenInUseUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
      NSLocationAlwaysUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
    },
  },
  android: {
    package: 'com.actito.sample.app.dev',
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ??
      './configuration/google-services.json',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: `${process.env.NOTIFICARE_APP_ID}.applinks.notifica.re`,
            pathPrefix: '/testdevice',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'sample-app-dev.ntc.re',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    'expo-router',
    [
      'react-native-actito',
      {
        ios: {
          servicesFile:
            process.env.NOTIFICARE_SERVICES_PLIST ??
            './configuration/NotificareServices.plist',
          optionsFile: './configuration/NotificareOptions.plist',
        },
        android: {
          servicesFile:
            process.env.NOTIFICARE_SERVICES_JSON ??
            './configuration/notificare-services.json',
          debugLoggingEnabled: true,
        },
      },
    ],
    [
      'react-native-actito-push',
      {
        ios: {
          mode: 'development',
          useNotificationServiceExtension: true,
          deploymentTarget: '15.1',
        },
        android: {
          urlSchemes: ['com.example', 'com.example2', 'com.example3'],
          notification: {
            smallIcon: './assets/notification-icon.png',
            smallIconAccentColor: '#fc0366',
          },
        },
      },
    ],
    [
      'react-native-actito-push-ui',
      {
        ios: {
          locales: {
            default: './assets/locales-ios/default.json',
            fr: './assets/locales-ios/french.json',
          },
        },
        android: {
          locales: {
            default: './assets/locales-android/default.json',
            fr: './assets/locales-android/french.json',
          },
        },
      },
    ],
    [
      'react-native-actito-geo',
      {
        android: {
          beaconSupportEnabled: true,
          beaconForegroundServiceEnabled: true,
          beaconForegroundServiceSmallIcon:
            './assets/beacon-notification-icon.png',
          beaconForegroundServiceTitle: 'Beacon notification title',
          beaconForegroundServiceMessage: 'Beacon notification message',
          beaconForegroundServiceShowProgress: true,
          monitoredRegionsLimit: 20,
        },
      },
    ],
    [
      'react-native-actito-scannables',
      {
        android: {
          customStyle: 'Theme.Actito.PushUI.Translucent',
        },
      },
    ],
    [
      'react-native-permissions',
      {
        iosPermissions: [
          'Camera',
          'Microphone',
          'LocationWhenInUse',
          'LocationAlways',
          'Notifications',
          'Bluetooth',
        ],
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: ['https://maven.notifica.re/prereleases'],
        },
        ios: {
          extraPods: [
            {
              name: 'Actito/ActitoKit',
              source: 'git@github.com:actito/actito-cocoapods-specs.git',
            },
          ],
        },
      },
    ],
    [
      'react-native-edge-to-edge',
      {
        android: {
          parentTheme: 'Default',
          enforceNavigationBarContrast: false,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '8e345d54-c98b-4e0f-8331-5b5086ae982d',
    },
  },
});
