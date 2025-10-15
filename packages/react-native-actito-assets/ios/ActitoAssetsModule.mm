#import "ActitoAssetsModule.h"

#if __has_include(<react_native_actito_assets/react_native_actito_assets-Swift.h>)
#import <react_native_actito_assets/react_native_actito_assets-Swift.h>
#else
#import "react_native_actito_assets-Swift.h"
#endif

@implementation ActitoAssetsModule {
    ActitoAssetsPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [ActitoAssetsPlugin new];
    }
    return self;
}

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(fetch:(NSString *)group
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetch:group resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeActitoAssetsModuleSpecJSI>(params);
}
#endif

@end
