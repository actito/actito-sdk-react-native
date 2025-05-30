import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { ActitoRegion } from './models/actito-region';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  hasLocationServicesEnabled(): Promise<boolean>;
  hasBluetoothEnabled(): Promise<boolean>;
  getMonitoredRegions(): Promise<ActitoRegion[]>;
  getEnteredRegions(): Promise<ActitoRegion[]>;
  enableLocationUpdates(): Promise<void>;
  disableLocationUpdates(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoGeoModule');
