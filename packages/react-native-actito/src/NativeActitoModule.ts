import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { ActitoApplication } from './models/actito-application';
import type { ActitoNotification } from './models/actito-notification';
import type { ActitoDynamicLink } from './models/actito-dynamic-link';
import type { ActitoDevice } from './models/actito-device';
import type { ActitoDoNotDisturb } from './models/actito-do-not-disturb';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  // Actito

  isConfigured(): Promise<boolean>;
  isReady(): Promise<boolean>;
  launch(): Promise<void>;
  unlaunch(): Promise<void>;
  getApplication(): Promise<ActitoApplication | null>;
  fetchApplication(): Promise<ActitoApplication>;
  fetchNotification(id: string): Promise<ActitoNotification>;
  fetchDynamicLink(url: string): Promise<ActitoDynamicLink>;
  canEvaluateDeferredLink(): Promise<boolean>;
  evaluateDeferredLink(): Promise<boolean>;

  // Actito device

  getCurrentDevice(): Promise<ActitoDevice | null>;
  getPreferredLanguage(): Promise<string | null>;
  updatePreferredLanguage(language: string | null): Promise<void>;
  registerUser(userId: string | null, userName: string | null): Promise<void>;
  updateUser(userId: string | null, userName: string | null): Promise<void>;
  fetchTags(): Promise<string[]>;
  addTag(tag: string): Promise<void>;
  addTags(tags: string[]): Promise<void>;
  removeTag(tag: string): Promise<void>;
  removeTags(tags: string[]): Promise<void>;
  clearTags(): Promise<void>;
  fetchDoNotDisturb(): Promise<ActitoDoNotDisturb | null>;
  updateDoNotDisturb(dnd: Object): Promise<void>;
  clearDoNotDisturb(): Promise<void>;
  fetchUserData(): Promise<Record<string, string>>;
  updateUserData(userData: Object): Promise<void>;

  // Actito events

  logCustom(event: string, data?: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoModule');
