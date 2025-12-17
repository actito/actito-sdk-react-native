import { FlatList, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActitoBeacon, ActitoGeo, ActitoRegion } from 'react-native-actito-geo';
import { beaconsStyles } from '@/styles/styles-beacons';
import { Beacon } from '@/components/beacons/beacon';
import { useNavigation } from 'expo-router';

export default function BeaconsScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState<{
    region: ActitoRegion;
    beacons: ActitoBeacon[];
  }>();

  useEffect(function setupListeners() {
    const subscriptions = [ActitoGeo.onBeaconsRanged(setData)];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useLayoutEffect(
    function setupToolbarActions() {
      navigation.setOptions({ title: data?.region?.name ?? 'Beacons' });
    },
    [navigation, data]
  );

  return (
    <>
      {(data == null || data.beacons.length === 0) && (
        <View style={beaconsStyles.emptyStateContainer}>
          <Text>No beacons in range.</Text>
        </View>
      )}

      {data != null && data.beacons.length > 0 && (
        <FlatList
          data={data.beacons}
          renderItem={({ item }) => <Beacon beacon={item} />}
        />
      )}
    </>
  );
}
