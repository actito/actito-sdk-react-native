# MIGRATING

Actito 5.x is a complete rebranding of the Notificare SDK. Most of the migration involves updating the implementation from Notificare to Actito while keeping the original method invocations.

## Deprecations

Crash reporting is now deprecated and disabled by default. We recommend using another solution to collect crash analytics.
In case you have explicitly opted in, consider removing the following:
- Android: remove `re.notifica.crash_reports_enabled` meta-data from your `AndroidManifest.xml`.
- iOS: remove `CRASH_REPORTING_ENABLED` from your `ActitoOptions.plist`

## Breaking changes

### Removals

- Removed Scannables module.

### Dependencies

Open your `package.json` file and align dependencies.
Keep only the dependencies that you already use in your project.

```diff
-    "react-native-notificare": "^4.0.0",
-    "react-native-notificare-assets": "^4.0.0",
-    "react-native-notificare-geo": "^4.0.0",
-    "react-native-notificare-in-app-messaging": "^4.0.0",
-    "react-native-notificare-inbox": "^4.0.0",
-    "react-native-notificare-loyalty": "^4.0.0",
-    "react-native-notificare-push": "^4.0.0",
-    "react-native-notificare-push-ui": "^4.0.0",
-    "react-native-notificare-user-inbox": "^4.0.0",

+    "react-native-actito": "^5.0.0",
+    "react-native-actito-assets": "^5.0.0",
+    "react-native-actito-geo": "^5.0.0",
+    "react-native-actito-in-app-messaging": "^5.0.0",
+    "react-native-actito-inbox": "^5.0.0",
+    "react-native-actito-loyalty": "^5.0.0",
+    "react-native-actito-push": "^5.0.0",
+    "react-native-actito-push-ui": "^5.0.0",
+    "react-native-actito-user-inbox": "^5.0.0",
```

### Setup

#### Android

Starting with version 5.0, all SDK artifacts are now published to **Maven Central**.
You no longer need to include the Notificare Maven repositories, and all artifacts have been moved from the `re.notifica` namespace to the new `com.actito` namespace.

This migration simplifies dependency management and aligns the SDK with standard Maven publishing practices.

##### Update the root `build.gradle`

```diff
plugins {
-    id 're.notifica.gradle.notificare-services' version '1.0.1' apply false
+    id 'com.actito.gradle.actito-services' version '1.0.0' apply false
}

allprojects {
    repositories {
-        maven { url 'https://maven.notifica.re/releases' }
-        maven { url 'https://maven.notifica.re/prereleases' }
   }
}
```

##### Update the app `build.gradle`

Open your **app module’s** `build.gradle` file and align the plugin implementation.

```diff
plugins {
-    id 're.notifica.gradle.notificare-services'
+    id 'com.actito.gradle.actito-services'
}
```

##### Adjust the constants in your `AndroidManifest.xml`
Open your `AndroidManifest.xml` file and rename all `re.notifica` constants to `com.actito`. For instance, here's an example of the changes to the trampoline intent:

```diff
<activity android:name=".MainActivity" android:launchMode="singleTask">
    <intent-filter>
-        <action android:name="re.notifica.intent.action.RemoteMessageOpened" />
+        <action android:name="com.actito.intent.action.RemoteMessageOpened" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

#### iOS

##### Notifications Service Extension

Open your iOS project in Xcode, navigate to project’s **Package Dependencies** settings, remove the Notificare package, and add the new Actito package instead:

```
https://github.com/actito/actito-sdk-ios.git
```

Make sure to replace the dependency in your targets from `NotificareNotificationServiceExtensionKit` to `ActitoNotificationServiceExtensionKit`.

### Configuration file

Rename configuration file:
- Android: `notificare-services.json` -> `actito-services.json`
- iOS: `NotificareServices.plist` -> `ActitoServices.plist`, also make sure to align the options file `NotificareOptions.plist` -> `ActitoOptions.plist`

### Implementation

You must update all references to the old Notificare classes and packages throughout your project.
Replace any class names starting with `Notificare` (for example, `NotificarePush`, `NotificarePushUI`, `NotificareGeo`, etc.) with their Actito equivalents (`ActitoPush`, `ActitoPushUI`, `ActitoGeo`, and so on).

Similarly, update all imports from the `import { Notificare* } from 'react-native-notificare*'` to `import { Actito* } from 'react-native-actito*'`.

Here is an example from the inbox implementation:

```diff
- import { NotificareInbox, NotificareInboxItem } from 'react-native-notificare-inbox';
- import { NotificarePushUI } from 'react-native-notificare-push-ui';

+ import { ActitoInbox, ActitoInboxItem } from 'react-native-actito-inbox';
+ import { ActitoPushUI } from 'react-native-actito-push-ui';

-  async function open(item: NotificareInboxItem) {
+  async function open(item: ActitoInboxItem) {
    try {
-      const notification = await NotificareInbox.open(item);
-      await NotificarePushUI.presentNotification(notification);

+      const notification = await ActitoInbox.open(item);
+      await ActitoPushUI.presentNotification(notification);
    } catch (e) {
      // handle error
    }
  }
```

> **Tip:**
>
> A global search-and-replace can accelerate this migration, but review your code carefully.

### Overriding Localizable Resources

#### Android

If your project overrides SDK-provided localizable strings or other resources, you must update their names to align with the new Actito namespace.
All resource identifiers previously prefixed with `notificare_` should now use the `actito_` prefix instead.

For example, in your `res/values-fr/strings.xml` file:

```diff
- <string name="notificare_dialog_cancel_button">Annuler</string>
+ <string name="actito_dialog_cancel_button">Annuler</string>
```

Ensure this change is applied consistently across all localized resource files (for example, values-es, values-fr, etc.) within your res directory.

> **Tip:**
>
> A global search for `notificare_` in your `res/` folder will help you quickly locate and rename all relevant keys to the new `actito_` format.

#### iOS

If your project overrides SDK-provided localizable strings or other resources, you must update their names to align with the new Actito namespace.
All resource identifiers previously prefixed with `notificare_` should now use the `actito_` prefix instead.

For example, in your `fr.lproj/Localizable.strings` file:

```diff
- notificare_cancel_button = "Annuler";
+ actito_cancel_button = "Annuler";
```

> **Tip:**
>
> A global search for `notificare_` in your localizable folder will help you quickly locate and rename all relevant keys to the new `actito_` format.

### Restricted Tag Naming

Tag naming rules have been tightened to ensure consistency.
Tags added using `Actito.device().addTag()` or `Actito.device().addTags()` must now adhere to the following constraints:

- The tag name must be between 3 and 64 characters in length.
- Tags must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are allowed within the name.

> **Example:**
>
> ✅ `premium_user`  ✅ `en-GB`  ❌ @user


### Restricted Event Naming and Payload Size

Event naming and payload validation rules have also been standardized.
Custom events logged with `Actito.events().logCustom()` must comply with the following:

- Event names must be between 3 and 64 characters.
- Event names must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are permitted.
- The event data payload is limited to 2 KB in size. Ensure you are not sending excessively large or deeply nested objects when calling: `Actito.shared.events().logCustom(eventName, data: data)`.

> **Tip:**
>
> To avoid exceeding the payload limit, keep your event data minimal — include only the essential key–value pairs required for personalized content or campaign targeting.
