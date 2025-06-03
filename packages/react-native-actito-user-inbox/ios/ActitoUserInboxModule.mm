#import "ActitoUserInboxModule.h"

#if __has_include(<react_native_actito_user_inbox/react_native_actito_user_inbox-Swift.h>)
#import <react_native_actito_user_inbox/react_native_actito_user_inbox-Swift.h>
#else
#import "react_native_actito_user_inbox-Swift.h"
#endif

@implementation ActitoUserInboxModule {
    ActitoUserInboxPlugin *plugin;
}

- (instancetype)init {
  self = [super init];
  if(self) {
      plugin = [ActitoUserInboxPlugin new];
  }
  return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(parseResponseFromJson:(NSDictionary *)json
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin parseResponseFromJson:json resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(parseResponseFromString:(NSString *)json
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin parseResponseFromString:json resolve:resolve reject:reject];
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

RCT_EXPORT_METHOD(remove:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin remove:item resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeActitoUserInboxModuleSpecJSI>(params);
}
#endif

@end
