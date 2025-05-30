#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoInAppMessagingModuleSpec.h"

@interface ActitoInAppMessagingModule : RCTEventEmitter <NativeActitoInAppMessagingModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoInAppMessagingModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
