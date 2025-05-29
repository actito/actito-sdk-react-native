package com.actito.assets.react_native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.assets.ktx.assets
import com.actito.assets.models.ActitoAsset

public class ActitoAssetsModule internal constructor(context: ReactApplicationContext) :
    ActitoAssetsModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun fetch(group: String, promise: Promise) {
        Actito.assets().fetch(group, object : ActitoCallback<List<ActitoAsset>> {
            override fun onSuccess(result: List<ActitoAsset>) {
                try {
                    val payload = Arguments.createArray()
                    result.forEach {
                        payload.pushMap(it.toJson().toReactMap())
                    }

                    promise.resolve(payload)
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    public companion object {
        internal const val NAME = "ActitoAssetsModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
