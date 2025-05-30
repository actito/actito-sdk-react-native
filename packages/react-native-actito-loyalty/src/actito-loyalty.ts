import { NativeModules, Platform } from 'react-native';
import type { ActitoPass } from './models/actito-pass';

const LINKING_ERROR =
  `The package 'react-native-actito-loyalty' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ActitoLoyaltyModule = isTurboModuleEnabled
  ? require('./NativeActitoLoyaltyModule').default
  : NativeModules.ActitoLoyaltyModule;

const NativeModule = ActitoLoyaltyModule
  ? ActitoLoyaltyModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ActitoLoyalty {
  //
  // Methods
  //

  /**
   * Fetches a pass by its serial number.
   *
   * @param {string} serial - The serial number of the pass to be fetched.
   * @return {Promise<ActitoPass>} - A promise that resolves to the fetched
   * {@link ActitoPass} corresponding to the given serial number.
   */
  public static async fetchPassBySerial(serial: string): Promise<ActitoPass> {
    return await NativeModule.fetchPassBySerial(serial);
  }

  /**
   * Fetches a pass by its barcode.
   *
   * @param {string} barcode - The barcode of the pass to be fetched.
   * @return {Promise<ActitoPass>} - A promise that resolves to the fetched
   * {@link ActitoPass} corresponding to the given barcode.
   */
  public static async fetchPassByBarcode(barcode: string): Promise<ActitoPass> {
    return await NativeModule.fetchPassByBarcode(barcode);
  }

  /**
   * Presents a pass to the user.
   *
   * @param {ActitoPass} pass - The {@link ActitoPass} to be presented
   * to the user.
   * @returns {Promise<void>} - A promise that resolves when the pass has
   * been successfully presented to the user.
   */
  public static async present(pass: ActitoPass): Promise<void> {
    await NativeModule.present(pass);
  }
}
