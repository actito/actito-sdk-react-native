import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Actito } from 'react-native-actito';
import { mainStyles } from '@/styles/styles';
import { LaunchFlowCard } from '@/components/home/launch-flow-card-view';
import { CurrentDeviceCardView } from '@/components/home/current-device-view';
import { RemoteNotificationsCardView } from '@/components/home/remote-notifications-card-view';
import { DnDNotificationsCardView } from '@/components/home/dnd-card-view';
import { GeoCardView } from '@/components/home/geo-card-view';
import { InAppMessagingCardView } from '@/components/home/iam-card-view';
import { OtherFeaturesCardView } from '@/components/home/other-features-card-view';
import { ActitoPush } from 'react-native-actito-push';
import { ActitoPushUI } from 'react-native-actito-push-ui';
import { ActitoScannables } from 'react-native-actito-scannables';
import { ActitoGeo } from 'react-native-actito-geo';
import {
  BackgroundCallbackBeaconEntered,
  BackgroundCallbackBeaconExited,
  BackgroundCallbackBeaconsRanged,
  BackgroundCallbackLocationUpdated,
  BackgroundCallbackRegionEntered,
  BackgroundCallbackRegionExited,
} from '@/components/background/background-callback';

export default function HomeScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(function setupListeners() {
    const subscriptions = [
      Actito.onReady(async (_) => {
        setIsReady(true);

        await handleDeferredLink();
        setupBackgroundCallbacks();
      }),

      Actito.onUnlaunched(() => setIsReady(false)),

      ActitoPush.onNotificationOpened(async (notification) => {
        await ActitoPushUI.presentNotification(notification);
      }),

      ActitoPush.onNotificationActionOpened(
        async ({ notification, action }) => {
          await ActitoPushUI.presentAction(notification, action);
        }
      ),

      ActitoScannables.onScannableDetected(async (scannable) => {
        if (scannable.notification != null) {
          await ActitoPushUI.presentNotification(scannable.notification);
        }
      }),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useEffect(function launch() {
    (async () => {
      await ActitoPush.setPresentationOptions(['banner', 'badge', 'sound']);
      await Actito.launch();

      Actito.onReady(async (_) => {
        setIsReady(true);

        await handleDeferredLink();
        setupBackgroundCallbacks();
      });
    })();
  }, []);

  async function handleDeferredLink() {
    try {
      if (!(await Actito.canEvaluateDeferredLink())) {
        return;
      }

      const evaluate = await Actito.evaluateDeferredLink();
      console.log(`Did evaluate deferred link: ${evaluate}`);
    } catch (e) {
      console.log('=== Error evaluating deferred link ===');
      console.log(JSON.stringify(e));
    }
  }

  function setupBackgroundCallbacks() {
    ActitoGeo.setLocationUpdatedBackgroundCallback(
      BackgroundCallbackLocationUpdated
    );

    ActitoGeo.setRegionEnteredBackgroundCallback(
      BackgroundCallbackRegionEntered
    );

    ActitoGeo.setRegionExitedBackgroundCallback(BackgroundCallbackRegionExited);

    ActitoGeo.setBeaconEnteredBackgroundCallback(
      BackgroundCallbackBeaconEntered
    );

    ActitoGeo.setBeaconExitedBackgroundCallback(BackgroundCallbackBeaconExited);

    ActitoGeo.setBeaconsRangedBackgroundCallback(
      BackgroundCallbackBeaconsRanged
    );
  }

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <LaunchFlowCard isReady={isReady} />

        {isReady && (
          <>
            <CurrentDeviceCardView />

            <RemoteNotificationsCardView />

            <DnDNotificationsCardView />

            <GeoCardView />

            <InAppMessagingCardView />

            <OtherFeaturesCardView />
          </>
        )}
      </View>
    </ScrollView>
  );
}
