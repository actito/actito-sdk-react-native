import {
  readResourcesXMLAsync,
  ResourceItemXML,
} from '@expo/config-plugins/build/android/Resources';
import { setStringItem } from '@expo/config-plugins/build/android/Strings';
import { writeXMLAsync } from '@expo/config-plugins/build/utils/XML';
import { addWarningAndroid } from '@expo/config-plugins/build/utils/warnings';
import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import { resolve } from 'path';

import { ActitoPushUIPluginProps } from '../types/types';
import { RESOURCE_ROOT_PATH } from 'react-native-actito/lib/plugin';
import { readLocales } from '../utils/locales';

const STRINGS_RESOURCE_NAME = 'strings.xml';

const withSetupLocalizable: ConfigPlugin<ActitoPushUIPluginProps> = (
  config,
  props
) => {
  const locales = props?.android?.locales;

  if (!locales) {
    return config;
  }

  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      await createStringsResource(locales, newConfig.modRequest.projectRoot);

      return newConfig;
    },
  ]);
};

async function createStringsResource(
  locales: { [p: string]: string },
  projectRoot: string
) {
  const localesMap = await readLocales(projectRoot, locales);
  const hasDefaultValues = Object.keys(localesMap).some(function (lang) {
    return lang === 'default';
  });

  if (!hasDefaultValues) {
    addWarningAndroid(
      'ActitoPushUIPluginProps.android.locales',
      'Default values for localization have not been provided.'
    );
  }

  for (const [langCode, localizationObj] of Object.entries(localesMap)) {
    const lang = transformLangAndRegionCode(langCode);

    const resPath = resolve(
      projectRoot,
      lang === 'default'
        ? `${RESOURCE_ROOT_PATH}/values`
        : `${RESOURCE_ROOT_PATH}/values-${lang}`,
      STRINGS_RESOURCE_NAME
    );

    const resXML = await readResourcesXMLAsync({ path: resPath });
    const stringsItemsXML: ResourceItemXML[] = [];

    for (const [key, value] of Object.entries(localizationObj)) {
      stringsItemsXML.push({
        _: value,
        $: {
          name: key,
        },
      });
    }

    // Sets string and updates if already exists
    const resultingXML = setStringItem(stringsItemsXML, resXML);

    await writeXMLAsync({ path: resPath, xml: resultingXML });
  }
}

function transformLangAndRegionCode(langCode: string): string {
  const match = langCode.match(/^([a-z]{2})-([A-Z]{2})$/);

  if (match) {
    return `${match[1]}-r${match[2]}`;
  }

  return langCode;
}

export const withActitoPushUIAndroidLocalizable: ConfigPlugin<
  ActitoPushUIPluginProps
> = (config, props) => {
  config = withSetupLocalizable(config, props);

  return config;
};
