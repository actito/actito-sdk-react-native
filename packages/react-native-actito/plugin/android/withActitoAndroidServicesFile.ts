import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import path from 'path';

import { copyResources } from '../utils/utils';
import type { ActitoPluginProps } from '../types/types';

const withSetActitoServicesFile: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  const servicesFilePath = props?.android?.servicesFile;

  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      if (!servicesFilePath) {
        throw new Error(
          'notificare-services.json file path is missing. Make sure to set android.servicesFile in react-native-actito plugin.'
        );
      }

      const sourcePath = path.resolve(
        newConfig.modRequest.projectRoot,
        servicesFilePath
      );

      const destinationPatch = path.resolve(
        newConfig.modRequest.projectRoot,
        './android/app/notificare-services.json'
      );

      copyResources(sourcePath, destinationPatch);

      return newConfig;
    },
  ]);
};

export const withActitoAndroidServiceFile: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  config = withSetActitoServicesFile(config, props);

  return config;
};
