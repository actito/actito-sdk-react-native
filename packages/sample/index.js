/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/app';
import { name as appName } from './app.json';
import { ActitoGeo } from 'react-native-actito-geo';
import {
  BackgroundCallbackBeaconEntered,
  BackgroundCallbackBeaconExited,
  BackgroundCallbackBeaconsRanged,
  BackgroundCallbackLocationUpdated,
  BackgroundCallbackRegionEntered,
  BackgroundCallbackRegionExited,
} from './src/background/background-callback';

function setupBackgroundCallbacks() {
  ActitoGeo.setLocationUpdatedBackgroundCallback(
    BackgroundCallbackLocationUpdated
  );

  ActitoGeo.setRegionEnteredBackgroundCallback(BackgroundCallbackRegionEntered);
  ActitoGeo.setRegionExitedBackgroundCallback(BackgroundCallbackRegionExited);
  ActitoGeo.setBeaconEnteredBackgroundCallback(BackgroundCallbackBeaconEntered);
  ActitoGeo.setBeaconExitedBackgroundCallback(BackgroundCallbackBeaconExited);
  ActitoGeo.setBeaconsRangedBackgroundCallback(BackgroundCallbackBeaconsRanged);
}

setupBackgroundCallbacks();

AppRegistry.registerComponent(appName, () => App);
