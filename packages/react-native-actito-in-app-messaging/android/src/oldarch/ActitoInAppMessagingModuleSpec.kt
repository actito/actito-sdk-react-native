package com.actito.iam.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

public abstract class ActitoInAppMessagingModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    // Actito In-App Messaging

    public abstract fun hasMessagesSuppressed(promise: Promise)
    public abstract fun setMessagesSuppressed(data: ReadableMap, promise: Promise)
}
