import { withActitoAndroid } from './android/withActitoAndroid';
import { withActitoIOS } from './ios/withActitoIOS';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { ActitoPluginProps } from './types/types';

const withActito: ConfigPlugin<ActitoPluginProps> = (config, props) => {
  config = withActitoAndroid(config, props);
  config = withActitoIOS(config, props);

  return config;
};

export default withActito;
