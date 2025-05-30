import { NativeModules, Platform } from 'react-native';
import type { ActitoUserInboxResponse } from './models/actito-user-inbox-response';
import type { ActitoNotification } from 'react-native-actito';
import type { ActitoUserInboxItem } from './models/actito-user-inbox-item';

const LINKING_ERROR =
  `The package 'react-native-actito-user-inbox' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ActitoUserInboxModule = isTurboModuleEnabled
  ? require('./NativeActitoUserInboxModule').default
  : NativeModules.ActitoUserInboxModule;

const NativeModule = ActitoUserInboxModule
  ? ActitoUserInboxModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ActitoUserInbox {
  //
  // Methods
  //

  /**
   * Parses a JSON {@link Record} to produce a {@link ActitoUserInboxResponse}.
   *
   * This method takes a raw JSON {@link Record} and converts it into a structured
   * {@link ActitoUserInboxResponse}.
   *
   * @param {Record<string, any>} json - The JSON Record representing the user
   * inbox response.
   * @return {Promise<ActitoUserInboxResponse>} - A promise that resolves to
   * a {@link ActitoUserInboxResponse} object parsed from the
   * provided JSON Record.
   */
  public static async parseResponseFromJson(
    json: Record<string, any>
  ): Promise<ActitoUserInboxResponse> {
    return await NativeModule.parseResponseFromJson(json);
  }

  /**
   * Parses a JSON string to produce a {@link ActitoUserInboxResponse}.
   *
   * This method takes a raw JSON string and converts it into a structured
   * {@link ActitoUserInboxResponse}.
   *
   * @param {string} json - The JSON string representing the user inbox response.
   * @return {Promise<ActitoUserInboxResponse>} - A promise that resolves to
   * a {@link ActitoUserInboxResponse} object parsed from the
   * provided JSON string.
   */
  public static async parseResponseFromString(
    json: string
  ): Promise<ActitoUserInboxResponse> {
    return await NativeModule.parseResponseFromString(json);
  }

  /**
   * Opens an inbox item and retrieves its associated notification.
   *
   * This function opens the provided {@link ActitoUserInboxItem} and returns
   * the associated {@link ActitoNotification}.
   * This operation marks the item as read.
   *
   * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem}
   * to be opened.
   * @return {Promise<ActitoNotification>} - A promise that resolves to the {@link ActitoNotification}
   * associated with the opened inbox item.
   */
  public static async open(
    item: ActitoUserInboxItem
  ): Promise<ActitoNotification> {
    return await NativeModule.open(item);
  }

  /**
   * Marks an inbox item as read.
   *
   * This function updates the status of the provided
   * {@link ActitoUserInboxItem} to read.
   *
   * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem}
   * to mark as read.
   * @returns {Promise<void>} - A promise that resolves when the inbox item has
   * been successfully marked as read.
   */
  public static async markAsRead(item: ActitoUserInboxItem): Promise<void> {
    return await NativeModule.markAsRead(item);
  }

  /**
   * Removes an inbox item from the user's inbox.
   *
   * This function deletes the provided {@link ActitoUserInboxItem} from the
   * user's inbox.
   *
   * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem}
   * to be removed.
   * @returns {Promise<void>} - A promise that resolves when the inbox item has
   * been successfully removed.
   */
  public static async remove(item: ActitoUserInboxItem): Promise<void> {
    return await NativeModule.remove(item);
  }
}
