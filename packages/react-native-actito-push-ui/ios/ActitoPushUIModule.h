#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoPushUIModuleSpec.h"

@interface ActitoPushUIModule : RCTEventEmitter <NativeActitoPushUIModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoPushUIModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
