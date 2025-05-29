import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { ActitoAsset } from './models/actito-asset';

export interface Spec extends TurboModule {
  //
  // Methods
  //

  fetch(group: string): Promise<ActitoAsset[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ActitoAssetsModule');
