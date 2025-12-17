import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { ActitoInboxItem } from './models/actito-inbox-item';
import type { ActitoNotification } from 'react-native-actito';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  getItems(): Promise<ActitoInboxItem[]>;
  getBadge(): Promise<number>;
  refresh(): Promise<void>;
  open(item: Object): Promise<ActitoNotification>;
  markAsRead(item: Object): Promise<void>;
  markAllAsRead(): Promise<void>;
  remove(item: Object): Promise<void>;
  clear(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoInboxModule');
