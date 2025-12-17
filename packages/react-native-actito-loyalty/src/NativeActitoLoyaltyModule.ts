import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { ActitoPass } from './models/actito-pass';

export interface Spec extends TurboModule {
  fetchPassBySerial(serial: string): Promise<ActitoPass>;
  fetchPassByBarcode(barcode: string): Promise<ActitoPass>;
  present(pass: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoLoyaltyModule');
