package com.actito.react_native

import android.app.Activity
import android.content.Intent
import androidx.core.net.toUri
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.ActitoEventData
import com.actito.ActitoIntentReceiver
import com.actito.internal.ktx.toEventData
import com.actito.models.ActitoApplication
import com.actito.models.ActitoDoNotDisturb
import com.actito.models.ActitoDynamicLink
import com.actito.models.ActitoNotification
import com.actito.models.ActitoUserData
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

public class ActitoModule internal constructor(context: ReactApplicationContext) :
    ActitoModuleSpec(context), ActivityEventListener {

    private var lifecycleEventListener: LifecycleEventListener? = null

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)

        if (Actito.intentReceiver == ActitoIntentReceiver::class.java) {
            Actito.intentReceiver = ActitoModuleIntentReceiver::class.java
        }

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        processInitialIntent()
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        processIntent(intent)
    }

    // endregion

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Actito

    @ReactMethod
    override fun isConfigured(promise: Promise) {
        promise.resolve(Actito.isConfigured)
    }

    @ReactMethod
    override fun isReady(promise: Promise) {
        promise.resolve(Actito.isReady)
    }

    @ReactMethod
    override fun launch(promise: Promise) {
        Actito.launch(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun unlaunch(promise: Promise) {
        Actito.unlaunch(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun getApplication(promise: Promise) {
        promise.resolve(Actito.application?.toJson()?.toReactMap())
    }

    @ReactMethod
    override fun fetchApplication(promise: Promise) {
        Actito.fetchApplication(object : ActitoCallback<ActitoApplication> {
            override fun onSuccess(result: ActitoApplication) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchNotification(id: String, promise: Promise) {
        Actito.fetchNotification(id, object : ActitoCallback<ActitoNotification> {
            override fun onSuccess(result: ActitoNotification) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchDynamicLink(url: String, promise: Promise) {
        val uri = url.toUri()

        Actito.fetchDynamicLink(uri, object : ActitoCallback<ActitoDynamicLink> {
            override fun onSuccess(result: ActitoDynamicLink) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun canEvaluateDeferredLink(promise: Promise) {
        Actito.canEvaluateDeferredLink(object : ActitoCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                promise.resolve(result)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun evaluateDeferredLink(promise: Promise) {
        Actito.evaluateDeferredLink(object : ActitoCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                promise.resolve(result)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    // region Actito device module

    @ReactMethod
    override fun getCurrentDevice(promise: Promise) {
        promise.resolve(Actito.device().currentDevice?.toJson()?.toReactMap())
    }

    @ReactMethod
    override fun getPreferredLanguage(promise: Promise) {
        promise.resolve(Actito.device().preferredLanguage)
    }

    @ReactMethod
    override fun updatePreferredLanguage(language: String?, promise: Promise) {
        Actito.device().updatePreferredLanguage(language, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun registerUser(userId: String?, userName: String?, promise: Promise) {
        Actito.device().register(userId, userName, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun updateUser(userId: String?, userName: String?, promise: Promise) {
        Actito.device().updateUser(userId, userName, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchTags(promise: Promise) {
        Actito.device().fetchTags(object : ActitoCallback<List<String>> {
            override fun onSuccess(result: List<String>) {
                promise.resolve(Arguments.fromArray(result.toTypedArray()))
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun addTag(tag: String, promise: Promise) {
        Actito.device().addTag(tag, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun addTags(payload: ReadableArray, promise: Promise) {
        val tags = payload.toArrayList().map { it.toString() }

        Actito.device().addTags(tags, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun removeTag(tag: String, promise: Promise) {
        Actito.device().removeTag(tag, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun removeTags(payload: ReadableArray, promise: Promise) {
        val tags = payload.toArrayList().map { it.toString() }

        Actito.device().removeTags(tags, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun clearTags(promise: Promise) {
        Actito.device().clearTags(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchDoNotDisturb(promise: Promise) {
        Actito.device().fetchDoNotDisturb(object : ActitoCallback<ActitoDoNotDisturb?> {
            override fun onSuccess(result: ActitoDoNotDisturb?) {
                promise.resolve(result?.toJson()?.toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun updateDoNotDisturb(payload: ReadableMap, promise: Promise) {
        val dnd = payload.toJson().let { ActitoDoNotDisturb.fromJson(it) }

        Actito.device().updateDoNotDisturb(dnd, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun clearDoNotDisturb(promise: Promise) {
        Actito.device().clearDoNotDisturb(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchUserData(promise: Promise) {
        Actito.device().fetchUserData(object : ActitoCallback<ActitoUserData> {
            override fun onSuccess(result: ActitoUserData) {
                val userData = result.let { userData ->
                    Arguments.createMap().apply {
                        userData.forEach {
                            putString(it.key, it.value)
                        }
                    }
                }

                promise.resolve(userData)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun updateUserData(payload: ReadableMap, promise: Promise) {
        val userData: Map<String, String?> = payload.let { reactMap ->
            val parsed = mutableMapOf<String, String?>()

            val iterator = reactMap.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                val value = reactMap.getString(key)

                parsed[key] = value
            }

            parsed
        }

        Actito.device().updateUserData(userData, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    // region Actito events module

    @ReactMethod
    override fun logCustom(event: String, dataMap: ReadableMap?, promise: Promise) {
        val data: ActitoEventData?

        try {
            data = dataMap?.toJson()?.toEventData()
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Actito.events().logCustom(event, data, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    private fun processInitialIntent() {
        val activity = reactApplicationContext.currentActivity ?: run {
            waitForActivityAndProcessInitialIntent()
            return
        }

        activity.intent?.also { processIntent(it) }
    }

    private fun waitForActivityAndProcessInitialIntent() {
        if (lifecycleEventListener != null) {
            logger.warning("Cannot await an Activity for more than one call.")
            return
        }

        lifecycleEventListener = object : LifecycleEventListener {
            override fun onHostResume() {
                val activity = reactApplicationContext.currentActivity

                if (activity == null) {
                    logger.warning("Cannot process the initial intent when the host resumed without an activity.")
                }

                activity?.intent?.also { processIntent(it) }

                lifecycleEventListener?.also { reactApplicationContext.removeLifecycleEventListener(it) }
                lifecycleEventListener = null
            }

            override fun onHostPause() {}

            override fun onHostDestroy() {}
        }.also { reactApplicationContext.addLifecycleEventListener(it) }
    }

    private fun processIntent(intent: Intent) {
        // Try handling the test device intent.
        if (Actito.handleTestDeviceIntent(intent)) return

        // Try handling the dynamic link intent.
        val activity = reactApplicationContext.currentActivity
        if (activity != null && Actito.handleDynamicLinkIntent(activity, intent)) return

        val url = intent.data?.toString()
        if (url != null) {
            EventBroker.dispatchEvent("com.actito.url_opened", url)
        }
    }

    public companion object {
        internal const val NAME = "ActitoModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
