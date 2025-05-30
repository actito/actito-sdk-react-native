#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoLoyaltyModuleSpec.h"

@interface ActitoLoyaltyModule : NSObject <NativeActitoLoyaltyModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoLoyaltyModule : NSObject <RCTBridgeModule>
#endif

@end
