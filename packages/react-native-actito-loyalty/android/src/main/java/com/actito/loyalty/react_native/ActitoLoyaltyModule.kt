package com.actito.loyalty.react_native

import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.loyalty.ktx.loyalty
import com.actito.loyalty.models.ActitoPass
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

public class ActitoLoyaltyModule internal constructor(context: ReactApplicationContext) :
    ActitoLoyaltyModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    // region Actito Loyalty

    @ReactMethod
    override fun fetchPassBySerial(serial: String, promise: Promise) {
        Actito.loyalty().fetchPassBySerial(serial, object : ActitoCallback<ActitoPass> {
            override fun onSuccess(result: ActitoPass) {
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

    @ReactMethod
    override fun fetchPassByBarcode(barcode: String, promise: Promise) {
        Actito.loyalty().fetchPassByBarcode(barcode, object : ActitoCallback<ActitoPass> {
            override fun onSuccess(result: ActitoPass) {
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

    @ReactMethod
    override fun present(data: ReadableMap, promise: Promise) {
        val pass: ActitoPass

        try {
            pass = ActitoPass.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val activity = reactApplicationContext.currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot present a pass without an activity.")
            return
        }

        Actito.loyalty().present(activity, pass)
        promise.resolve(null)
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoLoyaltyModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
