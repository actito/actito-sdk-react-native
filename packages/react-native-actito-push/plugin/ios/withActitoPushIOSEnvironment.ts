import { ConfigPlugin, withEntitlementsPlist } from 'expo/config-plugins';

import { ActitoPushPluginProps } from '../types/types';

const withAPNSEnvironment: ConfigPlugin<ActitoPushPluginProps> = (
  config,
  props
) => {
  return withEntitlementsPlist(config, (plist) => {
    if (props?.ios?.mode) {
      plist.modResults['aps-environment'] = props.ios.mode;
    } else {
      throw new Error(
        'Property "mode" is not set in "react-native-actito-push" plugin.'
      );
    }

    return plist;
  });
};

export const withActitoPushIOSEnvironment: ConfigPlugin<
  ActitoPushPluginProps
> = (config, props) => {
  config = withAPNSEnvironment(config, props);

  return config;
};
