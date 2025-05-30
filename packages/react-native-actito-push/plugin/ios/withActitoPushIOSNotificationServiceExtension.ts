/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ConfigPlugin,
  withInfoPlist,
  withXcodeProject,
} from '@expo/config-plugins';

import { setupNotificationServiceExtension } from './hooks/setup-notification-service-extension';
import { updateNotificationServicePlist } from './hooks/update-notification-service-plist';
import { ActitoPushPluginProps } from '../types/types';

const withSetupNotificationServiceExtension: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  return withXcodeProject(config, async (newConfig) => {
    const proj = newConfig.modResults;
    const projRoot = newConfig.modRequest.projectRoot;
    const appBundleID = newConfig.ios?.bundleIdentifier;
    const deploymentTarget = props?.ios?.deploymentTarget;

    newConfig.modResults = await setupNotificationServiceExtension(
      proj,
      projRoot,
      appBundleID,
      deploymentTarget
    );

    return newConfig;
  });
};

const withUpdateNotificationServiceExtensionPlist: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  return withInfoPlist(config, (newConfig) => {
    const projRoot = newConfig.modRequest.projectRoot;
    const bundleVersion = newConfig.modResults.CFBundleVersion;
    const bundleShortVersion = newConfig.modResults.CFBundleShortVersionString;

    updateNotificationServicePlist(projRoot, bundleVersion, bundleShortVersion);

    return newConfig;
  });
};

export const withActitoPushIOSNotificationServiceExtension: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  if (props?.ios?.useNotificationServiceExtension) {
    config = withSetupNotificationServiceExtension(config, props);
    config = withUpdateNotificationServiceExtensionPlist(config, props);
  }

  return config;
};
