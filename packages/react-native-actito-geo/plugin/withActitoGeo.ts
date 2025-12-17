import { withActitoGeoAndroid } from './android/withActitoGeoAndroid';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { ActitoGeoPluginProps } from './types/types';

const withActitoGeo: ConfigPlugin<ActitoGeoPluginProps> = (config, props) => {
  config = withActitoGeoAndroid(config, props);

  return config;
};

export default withActitoGeo;
