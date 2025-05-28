import { ConfigPlugin } from 'expo/config-plugins';
import { ActitoPluginProps } from '../types/types';
import {
  ActitoMetaDataOption,
  processManifestMetaDataOptions,
} from '../utils/android/manifest';

const withMetaDataOptions: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  const metaDataOptions: ActitoMetaDataOption[] = [
    {
      enabled: props?.android?.debugLoggingEnabled,
      metaData: {
        $: {
          'android:name': 'com.actito.debug_logging_enabled',
          'android:value': 'true',
        },
      },
    },
    {
      enabled: props?.android?.crashReportingEnabled === false,
      metaData: {
        $: {
          'android:name': 'com.actito.crash_reports_enabled',
          'android:value': 'false',
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

export const withActitoAndroidMonitoring: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  config = withMetaDataOptions(config, props);

  return config;
};
