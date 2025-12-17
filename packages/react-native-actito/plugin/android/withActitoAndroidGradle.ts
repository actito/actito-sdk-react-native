/* eslint-disable @typescript-eslint/no-unused-vars */

import { ProjectFile } from '@expo/config-plugins/build/android/Paths';
import {
  ConfigPlugin,
  withProjectBuildGradle,
  withAppBuildGradle,
  ExportedConfigWithProps,
} from 'expo/config-plugins';

import { ActitoPluginProps } from '../types/types';
import { replace } from '../utils/utils';

const ACTITO_SERVICES_GRADLE_PLUGIN = 'com.actito.gradle.actito-services';

const withProjectGradleDependencies: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  return withProjectBuildGradle(config, (newConfig) => {
    if (!isGroovy(newConfig)) {
      console.warn(
        'Unable to add Actito dependency to project, build.gradle is not groovy.'
      );

      return newConfig;
    }

    if (
      newConfig.modResults.contents.includes(
        'com.actito.gradle:actito-services'
      )
    ) {
      return newConfig;
    }

    newConfig.modResults.contents = replace(
      newConfig.modResults.contents,
      /dependencies\s?{/,
      `dependencies {
        classpath 'com.actito.gradle:actito-services:1.0.0'`
    );

    return newConfig;
  });
};

const withAppGradlePlugin: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  return withAppBuildGradle(config, (newConfig) => {
    if (!isGroovy(newConfig)) {
      console.warn(
        'Unable to apply Actito plugin, app build.gradle is not groovy.'
      );

      return newConfig;
    }

    if (newConfig.modResults.contents.includes(ACTITO_SERVICES_GRADLE_PLUGIN)) {
      return newConfig;
    }

    newConfig.modResults.contents = `${newConfig.modResults.contents}\napply plugin: '${ACTITO_SERVICES_GRADLE_PLUGIN}'`;

    return newConfig;
  });
};

const isGroovy: (
  gradle: ExportedConfigWithProps<ProjectFile<'groovy' | 'kt'>>
) => boolean = (gradle) => {
  return gradle.modResults.language === 'groovy';
};

export const withActitoAndroidGradle: ConfigPlugin<ActitoPluginProps> = (
  config,
  props
) => {
  config = withProjectGradleDependencies(config, props);
  config = withAppGradlePlugin(config, props);

  return config;
};
