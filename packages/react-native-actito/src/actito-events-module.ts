import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-actito' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ActitoModule = isTurboModuleEnabled
  ? require('./NativeActitoModule').default
  : NativeModules.ActitoModule;

const NativeModule = ActitoModule
  ? ActitoModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ActitoEventsModule {
  /**
   * Logs in Actito a custom event in the application.
   *
   * This function allows logging, in Actito, of application-specific events,
   * optionally associating structured data for more detailed event tracking and
   * analysis.
   *
   * @param {string} event - The name of the custom event to log.
   * @param {Record<string, any>} data - Optional structured event data for
   * further details.
   * @returns {Promise<void>} - A promise that resolves when the custom event
   * has been successfully logged.
   */
  public async logCustom(
    event: string,
    data?: Record<string, any>
  ): Promise<void> {
    await NativeModule.logCustom(event, data);
  }
}
