import { NativeModules, Platform } from 'react-native';
import type { ActitoAsset } from './models/actito-asset';

const LINKING_ERROR =
  `The package 'react-native-actito-assets' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ActitoAssetsModule = isTurboModuleEnabled
  ? require('./NativeActitoAssetsModule').default
  : NativeModules.ActitoAssetsModule;

const NativeModule = ActitoAssetsModule
  ? ActitoAssetsModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ActitoAssets {
  //
  // Methods
  //

  /**
   * Fetches a list of {@link ActitoAsset} for a specified group.
   *
   * @param {string} group - The name of the group whose assets are to be fetched.
   * @returns {Promise<ActitoAsset[]>} - A promise that resolves to a list of
   * {@link ActitoAsset} belonging to the specified group.
   */
  public static async fetch(group: string): Promise<ActitoAsset[]> {
    return await NativeModule.fetch(group);
  }
}
