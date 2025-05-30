import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { ActitoScannable } from './models/actito-scannable';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  canStartNfcScannableSession(): Promise<boolean>;
  startScannableSession(): Promise<void>;
  startNfcScannableSession(): Promise<void>;
  startQrCodeScannableSession(): Promise<void>;
  fetch(tag: string): Promise<ActitoScannable>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoScannablesModule');
