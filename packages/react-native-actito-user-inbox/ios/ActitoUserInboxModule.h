#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoUserInboxModuleSpec.h"

@interface ActitoUserInboxModule : NSObject <NativeActitoUserInboxModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoUserInboxModule : NSObject <RCTBridgeModule>
#endif

@end
