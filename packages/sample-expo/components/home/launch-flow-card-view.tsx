import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
// @ts-ignore
import { Actito } from 'react-native-actito';
import { useSnackbarContext } from '@/components/contexts/snackbar';
import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type LaunchFlowCardProps = {
  isReady: boolean;
};

export const LaunchFlowCard = (props: LaunchFlowCardProps) => {
  const { addSnackbarInfoMessage } = useSnackbarContext();

  async function launchActito() {
    try {
      console.log('=== Launching Actito ===');
      await Actito.launch();

      console.log('=== Launching Actito finished ===');
    } catch (e) {
      console.log('=== Error launching Actito ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error launching Actito.',
        type: 'error',
      });
    }
  }

  async function unlaunchActito() {
    try {
      console.log('=== Unlaunching Actito ===');
      await Actito.unlaunch();

      console.log('=== Unlaunching Actito finished ===');
    } catch (e) {
      console.log('=== Error unlaunching Actito ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error unlaunching Actito.',
        type: 'error',
      });
    }
  }

  async function showLaunchFlowInfo() {
    try {
      const isConfiguredStatus = await Actito.isConfigured();
      const isReadyStatus = await Actito.isReady();

      Alert.alert(
        'Actito Status',
        `isConfiguredInfo: ${isConfiguredStatus}
isReadyInfo: ${isReadyStatus}`,
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      );
    } catch (e) {
      console.log('=== Error getting isConfigured / isReady  ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting isConfigured / isReady.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Launch Flow</Text>

        <TouchableOpacity onPress={showLaunchFlowInfo}>
          <MaterialIcons name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.flex_row}>
          <TouchableOpacity
            style={[
              mainStyles.button,
              !props.isReady && mainStyles.button_disabled,
            ]}
            disabled={!props.isReady}
            onPress={unlaunchActito}
          >
            <Text>Unlaunch</Text>
          </TouchableOpacity>

          <View style={mainStyles.vertical_divider} />

          <TouchableOpacity
            style={[
              mainStyles.button,
              props.isReady && mainStyles.button_disabled,
            ]}
            disabled={props.isReady}
            onPress={launchActito}
          >
            <Text>Launch</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};
