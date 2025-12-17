import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { ActitoTransport } from './models/actito-transport';
import type { ActitoPushSubscription } from './models/actito-push-subscription';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  // region iOS only

  setAuthorizationOptions(options: string[]): Promise<void>;
  setCategoryOptions(options: string[]): Promise<void>;
  setPresentationOptions(options: string[]): Promise<void>;

  // end region

  hasRemoteNotificationsEnabled(): Promise<boolean>;
  getTransport(): Promise<ActitoTransport | null>;
  getSubscription(): Promise<ActitoPushSubscription | null>;
  allowedUI(): Promise<boolean>;
  enableRemoteNotifications(): Promise<void>;
  disableRemoteNotifications(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoPushModule');
