/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  getMainApplication,
  ManifestActivity,
} from '@expo/config-plugins/build/android/Manifest';
import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';
import { ActitoScannablesPluginProps } from '../types/types';

const SCANNABLES_ACTIVITY = 'com.actito.scannables.ScannableActivity';

const withApplyCustomStyle: ConfigPlugin<ActitoScannablesPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (newConfig) => {
    if (!props?.android?.customStyle) return newConfig;

    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    const notificationActivity: ManifestActivity = {
      $: {
        'android:name': SCANNABLES_ACTIVITY,
        'android:theme': `@style/${props.android.customStyle}`,
      },
    };

    const activities = application.activity;

    if (!activities) {
      application.activity = [notificationActivity];
      return newConfig;
    }

    if (
      !activities.find(
        (activity) =>
          activity.$['android:name'] === notificationActivity.$['android:name']
      )
    ) {
      activities.push(notificationActivity);
    }

    return newConfig;
  });
};

const withRemoveStyle: ConfigPlugin<ActitoScannablesPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (newConfig) => {
    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    const activities = application.activity;

    if (!activities) {
      return newConfig;
    }

    application.activity = activities.filter(
      (activity) => activity.$['android:name'] !== SCANNABLES_ACTIVITY
    );

    return newConfig;
  });
};

export const withActitoScannablesAndroid: ConfigPlugin<
  ActitoScannablesPluginProps
> = (config, props) => {
  if (props?.android?.customStyle) {
    config = withApplyCustomStyle(config, props);
  } else {
    withRemoveStyle(config, props);
  }

  return config;
};
