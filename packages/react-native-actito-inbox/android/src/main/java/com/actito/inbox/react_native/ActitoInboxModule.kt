package com.actito.inbox.react_native

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.inbox.ktx.inbox
import com.actito.inbox.models.ActitoInboxItem
import com.actito.models.ActitoNotification
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.util.SortedSet

public class ActitoInboxModule internal constructor(context: ReactApplicationContext) :
    ActitoInboxModuleSpec(context) {

    private val itemsObserver = Observer<SortedSet<ActitoInboxItem>> { items ->
        if (items == null) return@Observer

        try {
            val payload = Arguments.createArray()
            items.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            EventBroker.dispatchEvent("com.actito.inbox.inbox_updated", payload)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.inbox.inbox_updated event.", e)
        }
    }

    private val badgeObserver = Observer<Int> { badge ->
        if (badge == null) return@Observer

        EventBroker.dispatchEvent("com.actito.inbox.badge_updated", badge)
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)

        onMainThread {
            Actito.inbox().observableItems.observeForever(itemsObserver)
            Actito.inbox().observableBadge.observeForever(badgeObserver)
        }
    }

    override fun invalidate() {
        super.invalidate()

        onMainThread {
            Actito.inbox().observableItems.removeObserver(itemsObserver)
            Actito.inbox().observableBadge.removeObserver(badgeObserver)
        }
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

    // region Actito Inbox

    @ReactMethod
    override fun getItems(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Actito.inbox().items.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    override fun getBadge(promise: Promise) {
        promise.resolve(Actito.inbox().badge)
    }

    @ReactMethod
    override fun refresh(promise: Promise) {
        Actito.inbox().refresh(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun open(data: ReadableMap, promise: Promise) {
        val item: ActitoInboxItem

        try {
            item = ActitoInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.inbox().open(item, object : ActitoCallback<ActitoNotification> {
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
        val item: ActitoInboxItem

        try {
            item = ActitoInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.inbox().markAsRead(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun markAllAsRead(promise: Promise) {
        Actito.inbox().markAllAsRead(object : ActitoCallback<Unit> {
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
        val item: ActitoInboxItem

        try {
            item = ActitoInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.inbox().remove(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun clear(promise: Promise) {
        Actito.inbox().clear(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoInboxModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"

        internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
    }
}
