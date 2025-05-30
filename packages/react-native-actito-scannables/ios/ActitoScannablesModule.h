#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoScannablesModuleSpec.h"

@interface ActitoScannablesModule : RCTEventEmitter <NativeActitoScannablesModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoScannablesModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
