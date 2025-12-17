#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoGeoModuleSpec.h"

@interface ActitoGeoModule : RCTEventEmitter <NativeActitoGeoModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoGeoModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
