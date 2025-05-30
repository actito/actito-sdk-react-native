#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoPushModuleSpec.h"

@interface ActitoPushModule : RCTEventEmitter <NativeActitoPushModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoPushModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
