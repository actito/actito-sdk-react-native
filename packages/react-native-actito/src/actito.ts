import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import { ActitoDeviceModule } from './actito-device-module';
import { ActitoEventsModule } from './actito-events-module';
import type { ActitoApplication } from './models/actito-application';
import type { ActitoNotification } from './models/actito-notification';
import type { ActitoDynamicLink } from './models/actito-dynamic-link';
import type { ActitoDevice } from './models/actito-device';

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

export class Actito {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);
  private static readonly deviceModule = new ActitoDeviceModule();
  private static readonly eventsModule = new ActitoEventsModule();

  //
  // Modules
  //

  public static device(): ActitoDeviceModule {
    return this.deviceModule;
  }

  public static events(): ActitoEventsModule {
    return this.eventsModule;
  }

  //
  // Methods
  //

  /**
   * Indicates whether Actito has been configured.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if Actito
   * is successfully configured, and `false` otherwise.
   */
  public static async isConfigured(): Promise<boolean> {
    return await NativeModule.isConfigured();
  }

  /**
   * Indicates whether Actito is ready.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the SDK
   * has completed the initialization process and is ready for use.
   */
  public static async isReady(): Promise<boolean> {
    return await NativeModule.isReady();
  }

  /**
   * Launches the Actito SDK, and all the additional available modules,
   * preparing them for use.
   *
   * @returns {Promise<void>} - A promise that resolves when the Actito SDK
   * and its modules have been successfully launched and are ready for use.
   */
  public static async launch(): Promise<void> {
    await NativeModule.launch();
  }

  /**
   * Unlaunches the Actito SDK.
   *
   * This method shuts down the SDK, removing all data, both locally and remotely
   * in the servers. It destroys all the device's data permanently.
   *
   * @returns {Promise<void>} - A promise that resolves when the SDK has been
   * successfully unlaunched and all data has been removed.
   */
  public static async unlaunch(): Promise<void> {
    await NativeModule.unlaunch();
  }

  /**
   * Provides the current application metadata, if available.
   *
   * @returns {Promise<ActitoApplication | null>} - A promise that resolves
   * to a {@link ActitoApplication} object representing the configured
   * application, or `null` if the application is not yet available.
   */
  public static async getApplication(): Promise<ActitoApplication | null> {
    return await NativeModule.getApplication();
  }

  /**
   * Fetches the application metadata.
   *
   * @return {Promise<ActitoApplication>} - A promise that resolves to a
   * {@link ActitoApplication} object containing the application metadata.
   */
  public static async fetchApplication(): Promise<ActitoApplication> {
    return await NativeModule.fetchApplication();
  }

  /**
   * Fetches a {@link ActitoNotification} by its ID.
   *
   * @param {string} id - The ID of the notification to fetch.
   * @return {Promise<ActitoNotification>} - A promise that resolves to a
   * {@link ActitoNotification} object associated with the provided ID.
   */
  public static async fetchNotification(
    id: string
  ): Promise<ActitoNotification> {
    return await NativeModule.fetchNotification(id);
  }

  /**
   * Fetches a {@link ActitoDynamicLink} from a URL.
   *
   * @param {string} url - The URL to fetch the dynamic link from.
   * @return {Promise<ActitoDynamicLink >} - A promise that resolves to a
   * {@link ActitoDynamicLink} object.
   */
  public static async fetchDynamicLink(
    url: string
  ): Promise<ActitoDynamicLink> {
    return await NativeModule.fetchDynamicLink(url);
  }

  /**
   * Checks if a deferred link exists and can be evaluated.
   *
   * @return {Promise<Boolean>} - A promise that resolves to `true` if a deferred
   * link can be evaluated, `false` otherwise.
   */
  public static async canEvaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.canEvaluateDeferredLink();
  }

  /**
   * Evaluates the deferred link. Once the deferred link is evaluated, Actito
   * will open the resolved deep link.
   *
   * @return {Promise<boolean>} - A promise that resolves to `true` if the
   * deferred link was successfully evaluated, `false` otherwise.
   */
  public static async evaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.evaluateDeferredLink();
  }

  //
  // Events
  //

  /**
   * Called when the Actito SDK is fully ready and the application metadata
   * is available.
   *
   * This method is invoked after the SDK has been successfully launched and is
   * available for use.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onReady event. It will the {@link ActitoApplication} object containing
   * the application's metadata.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onReady event.
   */
  public static onReady(
    callback: (application: ActitoApplication) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('com.actito.ready', callback);
  }

  /**
   * Called when the Actito SDK has been unlaunched.
   *
   * This method is invoked after the SDK has been shut down (unlaunched) and
   * is no longer in use.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUnlaunched event.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onUnlaunched event.
   */
  public static onUnlaunched(callback: () => void): EmitterSubscription {
    return this.eventEmitter.addListener('com.actito.unlaunched', callback);
  }

  /**
   * Called when the device has been successfully registered with the Actito
   * platform.
   *
   * This method is triggered after the device is initially created, which
   * happens the first time `launch()` is called.
   * Once created, the method will not trigger again unless the device is
   * deleted by calling `unlaunch()` and created again on a new `launch()`.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onDeviceRegistered event. It will provide the registered {@link ActitoDevice}
   * instance representing the device's registration details.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onDeviceRegistered event.
   */
  public static onDeviceRegistered(
    callback: (device: ActitoDevice) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.device_registered',
      callback
    );
  }

  /**
   * Called when the device opens a URL.
   *
   * This method is invoked when the device opens a URL.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUrlOpened event. It will provide the opened URL.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onUrlOpened event.
   */
  public static onUrlOpened(
    callback: (url: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('com.actito.url_opened', callback);
  }
}
