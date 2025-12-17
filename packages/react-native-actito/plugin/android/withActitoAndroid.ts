import { withActitoAndroidServiceFile } from './withActitoAndroidServicesFile';
import type { ActitoPluginProps } from '../types/types';
import type { ConfigPlugin } from 'expo/config-plugins';
import { withActitoAndroidGradle } from './withActitoAndroidGradle';
import { withActitoAndroidMonitoring } from './withActitoAndroidMonitoring';

export const withActitoAndroid: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  config = withActitoAndroidServiceFile(config, props);
  config = withActitoAndroidGradle(config, props);
  config = withActitoAndroidMonitoring(config, props);

  return config;
};
