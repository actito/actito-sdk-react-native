import type { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPushUIPluginProps } from '../types/types';
import { withActitoPushUIAndroidStyle } from './withActitoPushUIAndroidStyle';
import { withActitoPushUIAndroidLocalizable } from './withActitoPushUIAndroidLocalizable';

export const withActitoPushUIAndroid: ConfigPlugin<ActitoPushUIPluginProps> = (
  config,
  props
) => {
  config = withActitoPushUIAndroidStyle(config, props);
  config = withActitoPushUIAndroidLocalizable(config, props);

  return config;
};
