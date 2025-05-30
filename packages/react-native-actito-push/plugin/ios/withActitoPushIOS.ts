import type { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPushPluginProps } from '../types/types';
import { withActitoPushIOSCapabilities } from './withActitoPushIOSCapabilities';
import { withActitoPushIOSEnvironment } from './withActitoPushIOSEnvironment';
import { withActitoPushIOSNotificationServiceExtension } from './withActitoPushIOSNotificationServiceExtension';

export const withActitoPushIOS: ConfigPlugin<ActitoPushPluginProps> = (
  config,
  props
) => {
  config = withActitoPushIOSCapabilities(config, props);
  config = withActitoPushIOSEnvironment(config, props);
  config = withActitoPushIOSNotificationServiceExtension(config, props);

  return config;
};
