import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import { ActitoPushPluginProps } from '../types/types';
import {
  parseXMLAsync,
  writeXMLAsync,
} from '@expo/config-plugins/build/utils/XML';
import { resolve } from 'path';
import {
  ActitoMetaDataOption,
  processManifestMetaDataOptions,
  RESOURCE_ROOT_PATH,
} from 'react-native-actito/lib/plugin';

const NOTIFICATION_SCHEMES_RESOURCE = 'actito_notification_url_schemes';

const withURLSchemes: ConfigPlugin<ActitoPushPluginProps> = (config, props) => {
  const schemes = props?.android?.urlSchemes;

  if (!schemes) {
    return config;
  }

  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      await createURLSchemesResource(schemes, newConfig.modRequest.projectRoot);

      return newConfig;
    },
  ]);
};

const withURLSchemesMetaData: ConfigPlugin<ActitoPushPluginProps> = (
  config,
  props
) => {
  const metaDataOptions: ActitoMetaDataOption[] = [
    {
      enabled: !!props?.android?.urlSchemes,
      metaData: {
        $: {
          'android:name': 'com.actito.push.ui.notification_url_schemes',
          'android:resource': `@array/${NOTIFICATION_SCHEMES_RESOURCE}`,
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

async function createURLSchemesResource(
  schemes: string[],
  projectRoot: string
) {
  const xml = await parseXMLAsync(`
  <resources>
    <string-array name="${NOTIFICATION_SCHEMES_RESOURCE}">
      ${schemes.map((scheme) => `\n<item>${scheme}</item>`).join('')}
    </string-array>
  </resources>
  `);

  const path = resolve(
    projectRoot,
    RESOURCE_ROOT_PATH + '/values',
    NOTIFICATION_SCHEMES_RESOURCE + '.xml'
  );

  await writeXMLAsync({ path, xml });
}

export const withActitoPushAndroidURLSchemes: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  config = withURLSchemes(config, props);
  config = withURLSchemesMetaData(config, props);

  return config;
};
