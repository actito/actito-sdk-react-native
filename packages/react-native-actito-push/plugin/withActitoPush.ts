import { withActitoPushAndroid } from './android/withActitoPushAndroid';
import { withActitoPushIOS } from './ios/withActitoPushIOS';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { ActitoPushPluginProps } from './types/types';

const withActitoPush: ConfigPlugin<ActitoPushPluginProps> = (config, props) => {
  config = withActitoPushAndroid(config, props);
  config = withActitoPushIOS(config, props);

  return config;
};

export default withActitoPush;
