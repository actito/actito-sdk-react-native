/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPushPluginProps } from '../types/types';
import {
  ActitoManifestIntentFilter,
  processIntentFilter,
} from 'react-native-actito/lib/plugin';

const withRemoteMessageTrampoline: ConfigPlugin<ActitoPushPluginProps> = (
  config,
  props
) => {
  const intent: ActitoManifestIntentFilter = {
    enabled: true,
    intentFilter: {
      action: [
        {
          $: {
            'android:name': 'com.actito.intent.action.RemoteMessageOpened',
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

export const withActitoPushAndroidManifest: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  config = withRemoteMessageTrampoline(config, props);

  return config;
};
