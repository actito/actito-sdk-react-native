import { withActitoIOSFiles } from './withActitoIOSFiles';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { ActitoPluginProps } from '../types/types';

export const withActitoIOS: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  config = withActitoIOSFiles(config, props);

  return config;
};
