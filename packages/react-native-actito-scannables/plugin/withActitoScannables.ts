import type { ConfigPlugin } from 'expo/config-plugins';
import { ActitoScannablesPluginProps } from './types/types';
import { withActitoScannablesAndroid } from './android/withActitoScannablesAndroid';

const withActitoScannables: ConfigPlugin<ActitoScannablesPluginProps> = (
  config,
  props
) => {
  config = withActitoScannablesAndroid(config, props);

  return config;
};

export default withActitoScannables;
