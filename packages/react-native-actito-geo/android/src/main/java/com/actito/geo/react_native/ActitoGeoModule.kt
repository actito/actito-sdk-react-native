package com.actito.geo.react_native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.actito.Actito
import com.actito.geo.ktx.geo

public class ActitoGeoModule internal constructor(context: ReactApplicationContext) :
    ActitoGeoModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Actito Geo

    @ReactMethod
    override fun hasLocationServicesEnabled(promise: Promise) {
        promise.resolve(Actito.geo().hasLocationServicesEnabled)
    }

    @ReactMethod
    override fun hasBluetoothEnabled(promise: Promise) {
        promise.resolve(Actito.geo().hasBluetoothEnabled)
    }

    @ReactMethod
    override fun getMonitoredRegions(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Actito.geo().monitoredRegions.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    override fun getEnteredRegions(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Actito.geo().enteredRegions.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    override fun enableLocationUpdates(promise: Promise) {
        Actito.geo().enableLocationUpdates()
        promise.resolve(null)
    }

    @ReactMethod
    override fun disableLocationUpdates(promise: Promise) {
        Actito.geo().disableLocationUpdates()
        promise.resolve(null)
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoGeoModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
