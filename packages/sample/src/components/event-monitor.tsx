import { useEffect } from 'react';
import { Actito } from 'react-native-actito';
// import { ActitoInbox } from 'react-native-actito-inbox';
import { ActitoPush } from 'react-native-actito-push';
import { ActitoGeo } from 'react-native-actito-geo';
// import { ActitoPushUI } from 'react-native-actito-push-ui';
// import { ActitoScannables } from 'react-native-actito-scannables';
import { ActitoInAppMessaging } from 'react-native-actito-in-app-messaging';
import { useSnackbarContext } from '../contexts/snackbar';
import { logCustomBackgroundEvent } from '../background/background-logger';
import { AppState, Platform } from 'react-native';

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

        // //
        // // Actito Push UI events
        // //
        // ActitoPushUI.onNotificationWillPresent((notification) => {
        //   console.log('=== NOTIFICATION WILL PRESENT ===');
        //   console.log(JSON.stringify(notification, null, 2));
        // }),
        //
        // ActitoPushUI.onNotificationPresented((notification) => {
        //   console.log('=== NOTIFICATION PRESENTED ===');
        //   console.log(JSON.stringify(notification, null, 2));
        // }),
        //
        // ActitoPushUI.onNotificationFinishedPresenting((notification) => {
        //   console.log('=== NOTIFICATION FINISHED PRESENTING ===');
        //   console.log(JSON.stringify(notification, null, 2));
        // }),
        //
        // ActitoPushUI.onNotificationFailedToPresent((notification) => {
        //   console.log('=== NOTIFICATION FAILED TO PRESENT ===');
        //   console.log(JSON.stringify(notification, null, 2));
        // }),
        //
        // ActitoPushUI.onNotificationUrlClicked(({ notification, url }) => {
        //   console.log('=== NOTIFICATION URL CLICKED ===');
        //   console.log(JSON.stringify({ notification, url }, null, 2));
        // }),
        //
        // ActitoPushUI.onActionWillExecute(({ notification, action }) => {
        //   console.log('=== ACTION WILL EXECUTE ===');
        //   console.log(JSON.stringify({ notification, action }, null, 2));
        // }),
        //
        // ActitoPushUI.onActionExecuted(({ notification, action }) => {
        //   console.log('=== ACTION EXECUTED ===');
        //   console.log(JSON.stringify({ notification, action }, null, 2));
        // }),
        //
        // ActitoPushUI.onActionNotExecuted(({ notification, action }) => {
        //   console.log('=== ACTION NOT EXECUTED ===');
        //   console.log(JSON.stringify({ notification, action }, null, 2));
        // }),
        //
        // ActitoPushUI.onActionFailedToExecute(
        //   ({ notification, action, error }) => {
        //     console.log('=== ACTION FAILED TO EXECUTE ===');
        //     console.log(
        //       JSON.stringify({ notification, action, error }, null, 2)
        //     );
        //   }
        // ),
        //
        // ActitoPushUI.onCustomActionReceived(
        //   ({ notification, action, url }) => {
        //     console.log('=== CUSTOM ACTION RECEIVED ===');
        //     console.log(JSON.stringify({ notification, action, url }, null, 2));
        //   }
        // ),
        //
        // //
        // // Actito Inbox events
        // //
        //
        // ActitoInbox.onInboxUpdated((items) => {
        //   console.log('=== INBOX UPDATED ===');
        //   console.log(JSON.stringify(items, null, 2));
        // }),
        //
        // ActitoInbox.onBadgeUpdated((badge) => {
        //   console.log('=== BADGE UPDATED ===');
        //   console.log(JSON.stringify(badge, null, 2));
        // }),
        //
        // //
        // // Actito Scannables events
        // //
        //
        // ActitoScannables.onScannableDetected(async (scannable) => {
        //   console.log('=== SCANNABLE DETECTED ===');
        //   console.log(JSON.stringify(scannable, null, 2));
        // }),
        //
        // ActitoScannables.onScannableSessionFailed((error) => {
        //   console.log('=== SCANNABLE SESSION FAILED ===');
        //   console.log(JSON.stringify(error, null, 2));
        // }),
        //
        //
        // Actito Geo events
        //

        ActitoGeo.onLocationUpdated(async (location) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('LocationUpdated', location);

            return;
          }

          console.log('=== LOCATION UPDATED ===');
          console.log(JSON.stringify(location, null, 2));
        }),

        ActitoGeo.onRegionEntered(async (region) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('RegionEntered', region);

            return;
          }

          console.log('=== REGION ENTERED ===');
          console.log(JSON.stringify(region, null, 2));
        }),

        ActitoGeo.onRegionExited(async (region) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('RegionExited', region);

            return;
          }

          console.log('=== REGION EXITED ===');
          console.log(JSON.stringify(region, null, 2));
        }),

        ActitoGeo.onBeaconEntered(async (beacon) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('BeaconEntered', beacon);

            return;
          }

          console.log('=== BEACON ENTERED ===');
          console.log(JSON.stringify(beacon, null, 2));
        }),

        ActitoGeo.onBeaconExited(async (beacon) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('BeaconExited', beacon);

            return;
          }

          console.log('=== BEACON EXITED ===');
          console.log(JSON.stringify(beacon, null, 2));
        }),

        ActitoGeo.onBeaconsRanged(async ({ region, beacons }) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('BeaconsRanged', {
              region,
              beacons,
            });

            return;
          }

          console.log('=== BEACONS RANGED ===');
          console.log(JSON.stringify({ region, beacons }, null, 2));
        }),

        ActitoGeo.onVisit(async (visit) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('Visit', visit);

            return;
          }

          console.log('=== VISIT ===');
          console.log(JSON.stringify(visit, null, 2));
        }),

        ActitoGeo.onHeadingUpdated(async (heading) => {
          if (isIOSBackgroundEvent()) {
            await logCustomBackgroundEvent('HeadingUpdated', heading);

            return;
          }

          console.log('=== HEADING UPDATED ===');
          console.log(JSON.stringify(heading, null, 2));
        }),

        //
        // Actito In-App Messaging
        //

        ActitoInAppMessaging.onMessagePresented((message) => {
          console.log('=== ON MESSAGE PRESENTED ===');
          console.log(JSON.stringify(message, null, 2));
        }),

        ActitoInAppMessaging.onMessageFinishedPresenting((message) => {
          console.log('=== ON MESSAGE FINISHED PRESENTING ===');
          console.log(JSON.stringify(message, null, 2));
        }),

        ActitoInAppMessaging.onMessageFailedToPresent((message) => {
          console.log('=== ON MESSAGE FAILED TO PRESENT ===');
          console.log(JSON.stringify(message, null, 2));
        }),

        ActitoInAppMessaging.onActionExecuted((data) => {
          console.log('=== ON ACTION EXECUTED ===');
          console.log(JSON.stringify(data, null, 2));
        }),

        ActitoInAppMessaging.onActionFailedToExecute((data) => {
          console.log('=== ON ACTION FAILED TO EXECUTE ===');
          console.log(JSON.stringify(data, null, 2));
        }),
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [addSnackbarInfoMessage]
  );

  function isIOSBackgroundEvent(): boolean {
    return (
      Platform.OS === 'ios' &&
      (AppState.currentState === 'unknown' ||
        AppState.currentState === 'background')
    );
  }

  return null;
}
