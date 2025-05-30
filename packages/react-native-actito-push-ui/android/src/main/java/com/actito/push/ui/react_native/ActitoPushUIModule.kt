package com.actito.push.ui.react_native

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.actito.Actito
import com.actito.models.ActitoNotification
import com.actito.push.ui.ActitoPushUI
import com.actito.push.ui.ktx.pushUI

public class ActitoPushUIModule internal constructor(context: ReactApplicationContext) :
    ActitoPushUIModuleSpec(context), ActitoPushUI.NotificationLifecycleListener {

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
        Actito.pushUI().addLifecycleListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Actito.pushUI().removeLifecycleListener(this)
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

    // region Actito Push UI

    @ReactMethod
    override fun presentNotification(data: ReadableMap, promise: Promise) {
        val notification: ActitoNotification

        try {
            notification = ActitoNotification.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot present a notification without an activity.")
            return
        }

        Actito.pushUI().presentNotification(activity, notification)
        promise.resolve(null)
    }

    @ReactMethod
    override fun presentAction(notificationData: ReadableMap, actionData: ReadableMap, promise: Promise) {
        val notification: ActitoNotification
        val action: ActitoNotification.Action

        try {
            notification = ActitoNotification.fromJson(notificationData.toJson())
            action = ActitoNotification.Action.fromJson(actionData.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot present a notification action without an activity.")
            return
        }

        Actito.pushUI().presentAction(activity, notification, action)
        promise.resolve(null)
    }

    // endregion

    // region ActitoPushUI.NotificationLifecycleListener

    override fun onNotificationWillPresent(notification: ActitoNotification) {
        try {
            EventBroker.dispatchEvent(
                "com.actito.push.ui.notification_will_present",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.notification_will_present event.", e)
        }
    }

    override fun onNotificationPresented(notification: ActitoNotification) {
        try {
            EventBroker.dispatchEvent("com.actito.push.ui.notification_presented", notification.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.notification_presented event.", e)
        }
    }

    override fun onNotificationFinishedPresenting(notification: ActitoNotification) {
        try {
            EventBroker.dispatchEvent(
                "com.actito.push.ui.notification_finished_presenting",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.notification_finished_presenting event.", e)
        }
    }

    override fun onNotificationFailedToPresent(notification: ActitoNotification) {
        try {
            EventBroker.dispatchEvent(
                "com.actito.push.ui.notification_failed_to_present",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.notification_failed_to_present event.", e)
        }
    }

    override fun onNotificationUrlClicked(notification: ActitoNotification, uri: Uri) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putString("url", uri.toString())

            EventBroker.dispatchEvent("com.actito.push.ui.notification_url_clicked", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.notification_url_clicked event.", e)
        }
    }

    override fun onActionWillExecute(notification: ActitoNotification, action: ActitoNotification.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("com.actito.push.ui.action_will_execute", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.action_will_execute event.", e)
        }
    }

    override fun onActionExecuted(notification: ActitoNotification, action: ActitoNotification.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("com.actito.push.ui.action_executed", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.action_executed event.", e)
        }
    }

    override fun onActionFailedToExecute(
        notification: ActitoNotification,
        action: ActitoNotification.Action,
        error: Exception?
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())
            if (error != null) arguments.putString("error", error.localizedMessage)

            EventBroker.dispatchEvent("com.actito.push.ui.action_failed_to_execute", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.action_failed_to_execute event.", e)
        }
    }

    override fun onCustomActionReceived(
        notification: ActitoNotification,
        action: ActitoNotification.Action,
        uri: Uri
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())
            arguments.putString("url", uri.toString())

            EventBroker.dispatchEvent("com.actito.push.ui.custom_action_received", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.ui.custom_action_received event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoPushUIModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
