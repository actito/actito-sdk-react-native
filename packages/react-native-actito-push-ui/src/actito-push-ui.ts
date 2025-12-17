import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type {
  ActitoNotification,
  ActitoNotificationAction,
} from 'react-native-actito';

const LINKING_ERROR =
  `The package 'react-native-actito-push-ui' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ActitoPushUIModule = isTurboModuleEnabled
  ? require('./NativeActitoPushUIModule').default
  : NativeModules.ActitoPushUIModule;

const NativeModule = ActitoPushUIModule
  ? ActitoPushUIModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ActitoPushUI {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  /**
   * Presents a notification to the user.
   *
   * This method launches the UI for displaying the provided
   * {@link ActitoNotification}.
   *
   * @param {ActitoNotification} notification - The {@link ActitoNotification}
   * to present.
   * @returns {Promise<void>} - A promise that resolves when the presentation
   * process is initiated.
   */
  public static async presentNotification(
    notification: ActitoNotification
  ): Promise<void> {
    await NativeModule.presentNotification(notification);
  }

  /**
   * Presents an action associated with a notification.
   *
   * This method presents the UI for executing a specific
   * {@link ActitoNotificationAction} associated with the provided
   * {@link ActitoNotification}.
   *
   * @param {ActitoNotification} notification - The {@link ActitoNotification}
   * to present.
   * @param {ActitoNotificationAction} action - The {@link ActitoNotificationAction}
   * to execute.
   * @returns {Promise<void>} - A promise that resolves when the presentation
   * process is initiated.
   */
  public static async presentAction(
    notification: ActitoNotification,
    action: ActitoNotificationAction
  ): Promise<void> {
    await NativeModule.presentAction(notification, action);
  }

  //
  // Events
  //

  /**
   * Called when a notification is about to be presented.
   *
   * This method is invoked before the notification is shown to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationWillPresent event. It will provide the
   * {@link ActitoNotification} that will be presented.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onNotificationWillPresent event.
   */
  static onNotificationWillPresent(
    callback: (notification: ActitoNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.notification_will_present',
      callback
    );
  }

  /**
   * Called when a notification has been presented.
   *
   * This method is triggered when the notification has been shown to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationPresented event. It will provide the
   * {@link ActitoNotification} that was presented.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onNotificationPresented event.
   */
  static onNotificationPresented(
    callback: (notification: ActitoNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.notification_presented',
      callback
    );
  }

  /**
   * Called when the presentation of a notification has finished.
   *
   * This method is invoked after the notification UI has been dismissed or the
   * notification interaction has completed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationFinishedPresenting event. It will provide the
   * {@link ActitoNotification} that finished presenting.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onNotificationFinishedPresenting event.
   */
  static onNotificationFinishedPresenting(
    callback: (notification: ActitoNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.notification_finished_presenting',
      callback
    );
  }

  /**
   * Called when a notification fails to present.
   *
   * This method is invoked if there is an error preventing the notification from
   * being presented.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationFailedToPresent event. It will provide the
   * {@link ActitoNotification} that failed to present.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onNotificationFailedToPresent event.
   */
  static onNotificationFailedToPresent(
    callback: (notification: ActitoNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.notification_failed_to_present',
      callback
    );
  }

  /**
   * Called when a URL within a notification is clicked.
   *
   * This method is triggered when the user clicks a URL in the notification.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationUrlClicked event. It will provide the string URL and the
   * {@link ActitoNotification} containing it.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onNotificationUrlClicked event.
   */
  static onNotificationUrlClicked(
    callback: (data: { notification: ActitoNotification; url: string }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.notification_url_clicked',
      callback
    );
  }

  /**
   * Called when an action associated with a notification is about to execute.
   *
   * This method is invoked right before the action associated with a notification
   * is executed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionWillExecute event. It will provide the
   * {@link ActitoNotificationAction} that will be executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onActionWillExecute event.
   */
  static onActionWillExecute(
    callback: (data: {
      notification: ActitoNotification;
      action: ActitoNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.action_will_execute',
      callback
    );
  }

  /**
   * Called when an action associated with a notification has been executed.
   *
   * This method is triggered after the action associated with the notification
   * has been successfully executed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionExecuted event. It will provide the
   * {@link ActitoNotificationAction} that was executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onActionExecuted event.
   */
  static onActionExecuted(
    callback: (data: {
      notification: ActitoNotification;
      action: ActitoNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.action_executed',
      callback
    );
  }

  /**
   * Called when an action associated with a notification is available but has
   * not been executed by the user.
   *
   * This method is triggered after the action associated with the notification
   * has not been executed, caused by user interaction.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionNotExecuted event. It will provide the
   * {@link ActitoNotificationAction} that was not executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onActionNotExecuted event.
   */
  static onActionNotExecuted(
    callback: (data: {
      notification: ActitoNotification;
      action: ActitoNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.action_not_executed',
      callback
    );
  }

  /**
   * Called when an action associated with a notification fails to execute.
   *
   * This method is triggered if an error occurs while trying to execute an
   * action associated with the notification.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionFailedToExecute event. It will provide the
   * {@link ActitoNotificationAction} that was failed to execute and the
   * {@link ActitoNotification} containing it. It may also provide the error
   * that caused the failure.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onActionFailedToExecute event.
   */
  static onActionFailedToExecute(
    callback: (data: {
      notification: ActitoNotification;
      action: ActitoNotificationAction;
      error?: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.action_failed_to_execute',
      callback
    );
  }

  /**
   * Called when a custom action associated with a notification is received.
   *
   * This method is triggered when a custom action associated with the
   * notification is received, such as a deep link or custom URL scheme.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onCustomActionReceived event. It will provide the
   * {@link ActitoNotificationAction} that triggered the custom action and
   * the {@link ActitoNotification} containing it. It also provides the URL
   * representing the custom action.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onCustomActionReceived event.
   */
  static onCustomActionReceived(
    callback: (data: {
      notification: ActitoNotification;
      action: ActitoNotificationAction;
      url: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'com.actito.push.ui.custom_action_received',
      callback
    );
  }
}
