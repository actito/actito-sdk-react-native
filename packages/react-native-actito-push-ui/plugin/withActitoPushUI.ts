import type { ConfigPlugin } from 'expo/config-plugins';
import type { ActitoPushUIPluginProps } from './types/types';
import { withActitoPushUIAndroid } from './android/withActitoPushUIAndroid';
import { withActitoPushUIIOS } from './ios/withActitoPushUIIOS';

const withActitoPushUI: ConfigPlugin<ActitoPushUIPluginProps> = (
  config,
  props
) => {
  config = withActitoPushUIAndroid(config, props);
  config = withActitoPushUIIOS(config, props);

  return config;
};

export default withActitoPushUI;
