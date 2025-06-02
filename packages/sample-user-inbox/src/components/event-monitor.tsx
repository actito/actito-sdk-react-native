import { useEffect } from 'react';
import { Actito } from 'react-native-actito';
import { ActitoPush } from 'react-native-actito-push';
import { ActitoPushUI } from 'react-native-actito-push-ui';
import { useSnackbarContext } from '../contexts/snackbar';

export function EventMonitor() {
  const { addSnackbarInfoMessage } = useSnackbarContext();

  useEffect(
    function setupListeners() {
      const subscriptions = [
        //
        // Actito events
        //

        Actito.onReady(async (application) => {
          console.log('=== ON READY ===');
          console.log(JSON.stringify(application, null, 2));

          addSnackbarInfoMessage({
            message: `Actito is ready: ${application.name}`,
            type: 'standard',
          });
        }),

        Actito.onUnlaunched(() => {
          console.log('=== ON UNLAUNCHED ===');

          addSnackbarInfoMessage({
            message: `Actito has finished un-launching.`,
            type: 'standard',
          });
        }),

        Actito.onDeviceRegistered((device) => {
          console.log('=== DEVICE REGISTERED ===');
          console.log(JSON.stringify(device, null, 2));

          addSnackbarInfoMessage({
            message: `Device registered: ${device.id}`,
            type: 'standard',
          });
        }),

        Actito.onUrlOpened((url) => {
          console.log('=== URL OPENED ===');
          console.log(JSON.stringify(url, null, 2));

          addSnackbarInfoMessage({
            message: `URL opened: ${url}`,
            type: 'standard',
          });
        }),

        //
        // Actito Push events
        //

        ActitoPush.onNotificationInfoReceived(
          ({ notification, deliveryMechanism }) => {
            console.log('=== NOTIFICATION RECEIVED ===');
            console.log(JSON.stringify(notification, null, 2));
            console.log(deliveryMechanism);
          }
        ),

        ActitoPush.onSystemNotificationReceived((notification) => {
          console.log('=== SYSTEM NOTIFICATION RECEIVED ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPush.onUnknownNotificationReceived((notification) => {
          console.log('=== UNKNOWN NOTIFICATION RECEIVED ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPush.onNotificationOpened(async (notification) => {
          console.log('=== NOTIFICATION OPENED ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPush.onNotificationActionOpened(
          async ({ notification, action }) => {
            console.log('=== NOTIFICATION ACTION OPENED ===');
            console.log(JSON.stringify({ notification, action }, null, 2));
          }
        ),

        ActitoPush.onUnknownNotificationOpened((notification) => {
          console.log('=== UNKNOWN NOTIFICATION OPENED ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPush.onUnknownNotificationActionOpened((data) => {
          console.log('=== UNKNOWN NOTIFICATION ACTION OPENED ===');
          console.log(JSON.stringify(data, null, 2));
        }),

        ActitoPush.onNotificationSettingsChanged((granted) => {
          console.log('=== NOTIFICATION SETTINGS CHANGED ===');
          console.log(JSON.stringify(granted, null, 2));
        }),

        ActitoPush.onSubscriptionChanged((subscription) => {
          console.log('=== SUBSCRIPTION CHANGED ===');
          console.log(JSON.stringify(subscription, null, 2));
        }),

        ActitoPush.onShouldOpenNotificationSettings((notification) => {
          console.log('=== SHOULD OPEN NOTIFICATION SETTINGS ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPush.onFailedToRegisterForRemoteNotifications((error) => {
          console.log('=== FAILED TO REGISTER FOR REMOTE NOTIFICATIONS ===');
          console.log(JSON.stringify(error, null, 2));
        }),

        //
        // Actito Push UI events
        //
        ActitoPushUI.onNotificationWillPresent((notification) => {
          console.log('=== NOTIFICATION WILL PRESENT ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPushUI.onNotificationPresented((notification) => {
          console.log('=== NOTIFICATION PRESENTED ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPushUI.onNotificationFinishedPresenting((notification) => {
          console.log('=== NOTIFICATION FINISHED PRESENTING ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPushUI.onNotificationFailedToPresent((notification) => {
          console.log('=== NOTIFICATION FAILED TO PRESENT ===');
          console.log(JSON.stringify(notification, null, 2));
        }),

        ActitoPushUI.onNotificationUrlClicked(({ notification, url }) => {
          console.log('=== NOTIFICATION URL CLICKED ===');
          console.log(JSON.stringify({ notification, url }, null, 2));
        }),

        ActitoPushUI.onActionWillExecute(({ notification, action }) => {
          console.log('=== ACTION WILL EXECUTE ===');
          console.log(JSON.stringify({ notification, action }, null, 2));
        }),

        ActitoPushUI.onActionExecuted(({ notification, action }) => {
          console.log('=== ACTION EXECUTED ===');
          console.log(JSON.stringify({ notification, action }, null, 2));
        }),

        ActitoPushUI.onActionNotExecuted(({ notification, action }) => {
          console.log('=== ACTION NOT EXECUTED ===');
          console.log(JSON.stringify({ notification, action }, null, 2));
        }),

        ActitoPushUI.onActionFailedToExecute(
          ({ notification, action, error }) => {
            console.log('=== ACTION FAILED TO EXECUTE ===');
            console.log(
              JSON.stringify({ notification, action, error }, null, 2)
            );
          }
        ),

        ActitoPushUI.onCustomActionReceived(({ notification, action, url }) => {
          console.log('=== CUSTOM ACTION RECEIVED ===');
          console.log(JSON.stringify({ notification, action, url }, null, 2));
        }),
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [addSnackbarInfoMessage]
  );

  return null;
}
