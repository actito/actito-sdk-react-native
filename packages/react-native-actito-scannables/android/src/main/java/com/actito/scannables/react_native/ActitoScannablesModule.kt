package com.actito.scannables.react_native

import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.scannables.ActitoScannables
import com.actito.scannables.ktx.scannables
import com.actito.scannables.models.ActitoScannable
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod

public class ActitoScannablesModule internal constructor(context: ReactApplicationContext) :
    ActitoScannablesModuleSpec(context), ActitoScannables.ScannableSessionListener {

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
        Actito.scannables().addListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Actito.scannables().removeListener(this)
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region ActitoScannables

    @ReactMethod
    override fun canStartNfcScannableSession(promise: Promise) {
        promise.resolve(Actito.scannables().canStartNfcScannableSession)
    }

    @ReactMethod
    override fun startScannableSession(promise: Promise) {
        val activity = reactApplicationContext.currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Actito.scannables().startScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    override fun startNfcScannableSession(promise: Promise) {
        val activity = reactApplicationContext.currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Actito.scannables().startNfcScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    override fun startQrCodeScannableSession(promise: Promise) {
        val activity = reactApplicationContext.currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Actito.scannables().startQrCodeScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    override fun fetch(tag: String, promise: Promise) {
        Actito.scannables().fetch(tag, object : ActitoCallback<ActitoScannable> {
            override fun onSuccess(result: ActitoScannable) {
                try {
                    promise.resolve(result.toJson().toReactMap())
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    // region ActitoScannables.ScannableSessionListener

    override fun onScannableDetected(scannable: ActitoScannable) {
        try {
            EventBroker.dispatchEvent("com.actito.scannables.scannable_detected", scannable.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.scannables.scannable_detected event.", e)
        }
    }

    override fun onScannableSessionError(error: Exception) {
        try {
            EventBroker.dispatchEvent("com.actito.scannables.scannable_session_failed", error.localizedMessage)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.scannables.scannable_session_failed event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoScannablesModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
