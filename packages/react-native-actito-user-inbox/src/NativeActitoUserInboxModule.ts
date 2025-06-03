import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { ActitoUserInboxResponse } from './models/actito-user-inbox-response';
import type { ActitoNotification } from 'react-native-actito';

export interface Spec extends TurboModule {
  parseResponseFromJson(json: Object): Promise<ActitoUserInboxResponse>;
  parseResponseFromString(json: string): Promise<ActitoUserInboxResponse>;
  open(item: Object): Promise<ActitoNotification>;
  markAsRead(item: Object): Promise<void>;
  remove(item: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoUserInboxModule');
