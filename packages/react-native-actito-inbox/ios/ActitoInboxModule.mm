#import "ActitoInboxModule.h"

#if __has_include(<react_native_actito_inbox/react_native_actito_inbox-Swift.h>)
#import <react_native_actito_inbox/react_native_actito_inbox-Swift.h>
#else
#import "react_native_actito_inbox-Swift.h"
#endif

@interface ActitoInboxModule () <ActitoInboxModuleDelegate>
@end

@implementation ActitoInboxModule {
    ActitoInboxPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [ActitoInboxPlugin new];
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

RCT_EXPORT_METHOD(getItems:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getItems:resolve reject:reject];
}

RCT_EXPORT_METHOD(getBadge:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getBadge:resolve reject:reject];
}

RCT_EXPORT_METHOD(refresh:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin refresh:resolve reject:reject];
}

RCT_EXPORT_METHOD(open:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin open:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(markAsRead:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin markAsRead:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(markAllAsRead:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin markAllAsRead:resolve reject:reject];
}

RCT_EXPORT_METHOD(remove:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin remove:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(clear:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin clear:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeActitoInboxModuleSpecJSI>(params);
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
