#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoInboxModuleSpec.h"

@interface ActitoInboxModule : RCTEventEmitter <NativeActitoInboxModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoInboxModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
