import { generateImageAsync } from '@expo/image-utils';
import { PropertiesItem } from '@expo/config-plugins/build/android/Properties';
import {
  ConfigPlugin,
  withDangerousMod,
  withGradleProperties,
} from 'expo/config-plugins';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ActitoGeoPluginProps } from '../types/types';
import {
  ActitoManifestIntentFilter,
  ActitoMetaDataOption,
  processIntentFilter,
  processManifestMetaDataOptions,
  RESOURCE_ROOT_PATH,
  SMALL_ICON_FORMATS,
} from 'react-native-actito/lib/plugin';

const BEACONS_SUPPORT_FLAG = 'actitoBeaconsSupportEnabled';
const BEACONS_FOREGROUND_SERVICE_ICON_NAME = 'actito_beacon_notification_icon';

const withBeaconsSupport: ConfigPlugin<ActitoGeoPluginProps> = (
  config,
  props
) => {
  if (props?.android?.beaconSupportEnabled === undefined) {
    return config;
  }

  const beaconsProp: PropertiesItem = {
    type: 'property',
    key: BEACONS_SUPPORT_FLAG,
    value: `${props.android.beaconSupportEnabled}`,
  };

  return withGradleProperties(config, (newConfig) => {
    const index = newConfig.modResults.findIndex(
      (item) => item.type === 'property' && item.key === BEACONS_SUPPORT_FLAG
    );

    if (index !== -1) {
      newConfig.modResults[index] = beaconsProp;
    } else {
      newConfig.modResults.push(beaconsProp);
    }

    return newConfig;
  });
};

const withForegroundServiceNotificationIcon: ConfigPlugin<
  ActitoGeoPluginProps
> = (config, props) => {
  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      if (props?.android?.beaconForegroundServiceSmallIcon) {
        await createForegroundServiceSmallIcon(
          props.android.beaconForegroundServiceSmallIcon,
          newConfig.modRequest.projectRoot
        );
      }

      return newConfig;
    },
  ]);
};

const withGeoMetaData: ConfigPlugin<ActitoGeoPluginProps> = (config, props) => {
  const metaDataOptions: ActitoMetaDataOption[] = [
    {
      enabled: !!props?.android?.monitoredRegionsLimit,
      metaData: {
        $: {
          'android:name': 'com.actito.geo.monitored_regions_limit',
          'android:value': `${props?.android?.monitoredRegionsLimit ?? 10}`,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceEnabled,
      metaData: {
        $: {
          'android:name': 'com.actito.geo.beacons.foreground_service_enabled',
          'android:value': 'true',
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceSmallIcon,
      metaData: {
        $: {
          'android:name':
            'com.actito.geo.beacons.service_notification_small_icon',
          'android:resource': `@drawable/${BEACONS_FOREGROUND_SERVICE_ICON_NAME}`,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceTitle,
      metaData: {
        $: {
          'android:name':
            'com.actito.geo.beacons.service_notification_content_title',
          'android:value': props?.android?.beaconForegroundServiceTitle,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceMessage,
      metaData: {
        $: {
          'android:name':
            'com.actito.geo.beacons.service_notification_content_text',
          'android:value': props?.android?.beaconForegroundServiceMessage,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceShowProgress,
      metaData: {
        $: {
          'android:name':
            'com.actito.geo.beacons.service_notification_progress',
          'android:value': 'true',
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

const withBeaconForegroundServiceIntent: ConfigPlugin<ActitoGeoPluginProps> = (
  config,
  props
) => {
  const intent: ActitoManifestIntentFilter = {
    enabled: !!props?.android?.beaconForegroundServiceEnabled,
    intentFilter: {
      action: [
        {
          $: {
            'android:name': 'com.actito.intent.action.BeaconNotificationOpened',
          },
        },
      ],
      category: [
        {
          $: {
            'android:name': 'android.intent.category.DEFAULT',
          },
        },
      ],
    },
  };

  return processIntentFilter(config, intent);
};

async function createForegroundServiceSmallIcon(
  icon: string,
  projectRoot: string
) {
  for (const formatType in SMALL_ICON_FORMATS) {
    const path = resolve(projectRoot, RESOURCE_ROOT_PATH, formatType);

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const resizedIcon = (
      await generateImageAsync(
        { projectRoot, cacheType: 'actito-beacon-notification-icon' },
        {
          src: icon,
          width: SMALL_ICON_FORMATS[formatType],
          height: SMALL_ICON_FORMATS[formatType],
          resizeMode: 'cover',
          backgroundColor: 'transparent',
        }
      )
    ).source;

    const resizedIconDest = resolve(
      path,
      BEACONS_FOREGROUND_SERVICE_ICON_NAME + '.png'
    );
    writeFileSync(resizedIconDest, resizedIcon);
  }
}

export const withActitoGeoAndroid: ConfigPlugin<ActitoGeoPluginProps> = (
  config,
  props
) => {
  config = withBeaconsSupport(config, props);
  config = withForegroundServiceNotificationIcon(config, props);
  config = withGeoMetaData(config, props);
  config = withBeaconForegroundServiceIntent(config, props);

  return config;
};
