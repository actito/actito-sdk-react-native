#ifdef RCT_NEW_ARCH_ENABLED
#import "RNActitoAssetsModuleSpec.h"

@interface ActitoAssetsModule : NSObject <NativeActitoAssetsModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ActitoAssetsModule : NSObject <RCTBridgeModule>
#endif

@end
