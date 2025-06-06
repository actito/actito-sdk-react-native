package com.actito.inbox.user.react_native

import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.inbox.user.ktx.userInbox
import com.actito.inbox.user.models.ActitoUserInboxItem
import com.actito.models.ActitoNotification
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

public class ActitoUserInboxModule internal constructor(context: ReactApplicationContext) :
    ActitoUserInboxModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun parseResponseFromJson(data: ReadableMap, promise: Promise) {
        try {
            val response = Actito.userInbox().parseResponse(data.toJson())
            promise.resolve(response.toJson().toReactMap())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    override fun parseResponseFromString(json: String, promise: Promise) {
        try {
            val response = Actito.userInbox().parseResponse(json)
            promise.resolve(response.toJson().toReactMap())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    override fun open(data: ReadableMap, promise: Promise) {
        val item: ActitoUserInboxItem

        try {
            item = ActitoUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.userInbox().open(item, object : ActitoCallback<ActitoNotification> {
            override fun onSuccess(result: ActitoNotification) {
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
    override fun markAsRead(data: ReadableMap, promise: Promise) {
        val item: ActitoUserInboxItem

        try {
            item = ActitoUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.userInbox().markAsRead(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun remove(data: ReadableMap, promise: Promise) {
        val item: ActitoUserInboxItem

        try {
            item = ActitoUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.userInbox().remove(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    public companion object {
        internal const val NAME = "ActitoUserInboxModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
