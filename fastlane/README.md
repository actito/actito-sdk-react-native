fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### update_native_libraries

```sh
[bundle exec] fastlane update_native_libraries
```

Updates the versions of the native libraries.

#### Options
* `version`: The version of the native libraries.
* `platform`: The platform to update. Leave blank to update both.

#### Examples
```sh
bundle exec fastlane update_native_libraries version:3.4.0
bundle exec fastlane update_native_libraries version:3.4.0 platform:android
bundle exec fastlane update_native_libraries version:3.4.0 platform:ios
```


### update_android_gradle_plugin

```sh
[bundle exec] fastlane update_android_gradle_plugin
```

Updates the Android Gradle Plugin version of each package.

#### Options
* `version`: The new version for the Android Gradle Plugin.

#### Examples
```sh
bundle exec fastlane update_android_gradle_plugin version:7.4.2
```


### bump

```sh
[bundle exec] fastlane bump
```

Updates the version of each package.

#### Options
* `version`: The new version for the libraries.

#### Examples
```sh
bundle exec fastlane bump version:3.4.0
```


### update_sample_apps

```sh
[bundle exec] fastlane update_sample_apps
```

Updates native iOS dependencies of both sample apps.

#### Options
* `local`: Use local iOS SDK libs for sample apps Pods and SPM dependencies.

#### Examples
```sh
bundle exec fastlane update_sample_apps
bundle exec fastlane update_sample_apps local:true
```


### publish

```sh
[bundle exec] fastlane publish
```

Validates and publishes each package.

#### Options
* `dry_run`: Only run in validation mode.

#### Examples
```sh
bundle exec fastlane publish
bundle exec fastlane publish dry_run:true
```


----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
