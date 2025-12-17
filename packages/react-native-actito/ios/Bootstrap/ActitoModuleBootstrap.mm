#import "ActitoModuleBootstrap.h"

#import <CoreData/NSManagedObject.h>
#import <ActitoKit/ActitoKit-Swift.h>

#if __has_include(<react_native_actito/react_native_actito-Swift.h>)
#import <react_native_actito/react_native_actito-Swift.h>
#else
#import "react_native_actito-Swift.h"
#endif

@implementation ActitoModuleBootstrap {

}
+ (void)load {
     [ActitoModuleBootstrapImpl setup];
}

@end
