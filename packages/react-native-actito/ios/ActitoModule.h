#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoModuleSpec.h"

@interface ActitoModule : RCTEventEmitter <NativeActitoModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
