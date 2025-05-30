import type { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPushPluginProps } from '../types/types';
import { withActitoPushAndroidManifest } from './withActitoPushAndroidManifest';
import { withActitoPushAndroidNotification } from './withActitoPushAndroidNotification';
import { withActitoPushAndroidURLSchemes } from './withActitoPushAndroidURLSchemes';

export const withActitoPushAndroid: ConfigPlugin<ActitoPushPluginProps> = (
  config,
  props
) => {
  config = withActitoPushAndroidManifest(config, props);
  config = withActitoPushAndroidNotification(config, props);
  config = withActitoPushAndroidURLSchemes(config, props);

  return config;
};
