import type { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPushUIPluginProps } from '../types/types';
import { withActitoPushUIIOSLocalizable } from './withActitoPushUIIOSLocalizable';

export const withActitoPushUIIOS: ConfigPlugin<ActitoPushUIPluginProps> = (
  config,
  props
) => {
  config = withActitoPushUIIOSLocalizable(config, props);

  return config;
};
