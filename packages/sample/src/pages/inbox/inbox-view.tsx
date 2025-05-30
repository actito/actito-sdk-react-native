import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { ActitoInbox, ActitoInboxItem } from 'react-native-actito-inbox';
import { InboxItem } from './views/inbox-item';
// import { ActitoPushUI } from 'react-native-actito-push-ui';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { inboxStyles } from '../../styles/styles-inbox';
import { bottomSheetStyles } from '../../styles/styles-bottom-sheet';
import { useSnackbarContext } from '../../contexts/snackbar';

export const InboxView: FC = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const navigation = useNavigation();
  const [items, setItems] = useState<ActitoInboxItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ActitoInboxItem | null>(
    null
  );

  useEffect(
    function loadInboxItems() {
      (async () => {
        try {
          setItems(await ActitoInbox.getItems());
        } catch (e) {
          console.log('=== Error getting inbox items ===');
          console.log(JSON.stringify(e));

          addSnackbarInfoMessage({
            message: 'Error getting inbox items.',
            type: 'error',
          });
        }
      })();
    },
    [addSnackbarInfoMessage]
  );

  useEffect(function setupListeners() {
    const subscriptions = [ActitoInbox.onInboxUpdated(setItems)];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useLayoutEffect(function setupToolbarActions() {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Icon.Button
            name="sync"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            style={inboxStyles.toolbarAction}
            onPress={refresh}
          />

          <Icon.Button
            name="mark-email-read"
            style={inboxStyles.toolbarAction}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            onPress={markAllAsRead}
          />

          <Icon.Button
            style={inboxStyles.toolbarAction}
            name="delete-sweep"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            onPress={clear}
          />
        </>
      ),
    });
  });

  async function open(item: ActitoInboxItem) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const notification = await ActitoInbox.open(item);
      // await ActitoPushUI.presentNotification(notification);
      console.log('=== Notification opened and presented successfully ===');

      addSnackbarInfoMessage({
        message: 'Notification opened and presented successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error opening or presenting notification ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error opening or presenting notification.',
        type: 'error',
      });
    }
  }

  async function markAsRead(item: ActitoInboxItem) {
    try {
      await ActitoInbox.markAsRead(item);
      console.log('=== Marked as read successfully ===');

      addSnackbarInfoMessage({
        message: 'Marked as read successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error marked as read ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error marked as read.',
        type: 'error',
      });
    }
  }

  async function remove(item: ActitoInboxItem) {
    try {
      await ActitoInbox.remove(item);
      console.log('=== Removed successfully ===');

      addSnackbarInfoMessage({
        message: 'Removed successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error removing inbox item ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error removing inbox item.',
        type: 'error',
      });
    }
  }

  async function refresh() {
    try {
      await ActitoInbox.refresh();
      console.log('=== Inbox refreshed successfully ===');

      addSnackbarInfoMessage({
        message: 'Inbox refreshed successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error refresh inbox ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error refresh inbox.',
        type: 'error',
      });
    }
  }

  async function markAllAsRead() {
    try {
      await ActitoInbox.markAllAsRead();
      console.log('=== Marked all as read successfully ===');

      addSnackbarInfoMessage({
        message: 'Marked all as read successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error mark all as read ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error mark all as read.',
        type: 'error',
      });
    }
  }

  async function clear() {
    try {
      await ActitoInbox.clear();
      console.log('=== Cleared inbox successfully ===');

      addSnackbarInfoMessage({
        message: 'Cleared inbox successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error clear inbox ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error clear inbox.',
        type: 'error',
      });
    }
  }

  async function onBottomSheetActionClicked(
    action: InboxBottomSheetActions['action']
  ) {
    if (selectedItem === null) {
      return;
    }

    const item = selectedItem;
    setSelectedItem(null);

    switch (action) {
      case 'open':
        await open(item);
        break;
      case 'markAsRead':
        await markAsRead(item);
        break;
      case 'remove':
        await remove(item);
        break;
      case 'cancel':
        break;
    }
  }

  return (
    <>
      {items.length === 0 && (
        <View style={inboxStyles.emptyStateContainer}>
          <Text>You have no messages</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => open(item)}
              onLongPress={() => setSelectedItem(item)}
            >
              <View>
                <InboxItem item={item} />
              </View>
            </TouchableWithoutFeedback>
          )}
          // Temporary workaround for https://github.com/software-mansion/react-native-screens/issues/2282
          removeClippedSubviews={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedItem !== null}
        onTouchEnd={() => onBottomSheetActionClicked('cancel')}
      >
        <Pressable
          style={bottomSheetStyles.overlay}
          onPress={() => onBottomSheetActionClicked('cancel')}
        />

        <View>
          <View style={bottomSheetStyles.bottomSheet}>
            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('open')}
            >
              <Text>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('markAsRead')}
            >
              <Text>Mark as Read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('remove')}
            >
              <Text>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[bottomSheetStyles.button]}
              onPress={() => onBottomSheetActionClicked('cancel')}
            >
              <Text style={[bottomSheetStyles.buttonCancel]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

interface InboxBottomSheetActions {
  action: 'open' | 'markAsRead' | 'remove' | 'cancel';
}
