#import "ActitoInAppMessagingModule.h"

#if __has_include(<react_native_actito_in_app_messaging/react_native_actito_in_app_messaging-Swift.h>)
#import <react_native_actito_in_app_messaging/react_native_actito_in_app_messaging-Swift.h>
#else
#import "react_native_actito_in_app_messaging-Swift.h"
#endif

@interface ActitoInAppMessagingModule () <ActitoInAppMessagingModuleDelegate>
@end

@implementation ActitoInAppMessagingModule {
    ActitoInAppMessagingPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [ActitoInAppMessagingPlugin new];
        plugin.delegate = self;
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

RCT_EXPORT_METHOD(hasMessagesSuppressed:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin hasMessagesSuppressed:resolve reject:reject];
}

RCT_EXPORT_METHOD(setMessagesSuppressed:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin setMessagesSuppressed:data resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeActitoInAppMessagingModuleSpecJSI>(params);
}
#endif

// Event Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [plugin supportedEvents];
}

- (void)startObserving {
    [plugin startObserving];
}

- (void)stopObserving {
    [plugin stopObserving];
}

- (void)broadcastEventWithName:(NSString * _Nonnull)name body:(id _Nullable)body {
    [self sendEventWithName:name body:body];
}

@end
