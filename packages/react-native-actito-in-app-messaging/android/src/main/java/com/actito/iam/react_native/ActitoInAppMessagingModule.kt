package com.actito.iam.react_native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.actito.Actito
import com.actito.iam.ActitoInAppMessaging
import com.actito.iam.ktx.inAppMessaging
import com.actito.iam.models.ActitoInAppMessage

public class ActitoInAppMessagingModule internal constructor(context: ReactApplicationContext) :
    ActitoInAppMessagingModuleSpec(context), ActitoInAppMessaging.MessageLifecycleListener {

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
        Actito.inAppMessaging().addLifecycleListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Actito.inAppMessaging().removeLifecycleListener(this)
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Actito In-App Messaging

    @ReactMethod
    override fun hasMessagesSuppressed(promise: Promise) {
        promise.resolve(Actito.inAppMessaging().hasMessagesSuppressed)
    }

    @ReactMethod
    override fun setMessagesSuppressed(data: ReadableMap, promise: Promise) {
        val arguments = data.toJson()
        val suppressed = try {
            arguments.getBoolean("suppressed")
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val evaluateContext =
            if (!arguments.isNull("evaluateContext")) {
                arguments.getBoolean("evaluateContext")
            } else {
                false
            }

        Actito.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext)

        promise.resolve(null)
    }

    // endregion

    // region ActitoInAppMessaging.MessageLifecycleListener

    override fun onMessagePresented(message: ActitoInAppMessage) {
        try {
            EventBroker.dispatchEvent("com.actito.iam.message_presented", message.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.iam.message_presented event.", e)
        }
    }

    override fun onMessageFinishedPresenting(message: ActitoInAppMessage) {
        try {
            EventBroker.dispatchEvent("com.actito.iam.message_finished_presenting", message.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("com.actito.iam.Failed to emit the message_finished_presenting event.", e)
        }
    }

    override fun onMessageFailedToPresent(message: ActitoInAppMessage) {
        try {
            EventBroker.dispatchEvent("com.actito.iam.message_failed_to_present", message.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.iam.message_failed_to_present event.", e)
        }
    }

    override fun onActionExecuted(message: ActitoInAppMessage, action: ActitoInAppMessage.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("message", message.toJson().toReactMap())
            arguments.putMap("action", message.toJson().toReactMap())

            EventBroker.dispatchEvent("com.actito.iam.action_executed", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.iam.action_executed event.", e)
        }
    }

    override fun onActionFailedToExecute(
        message: ActitoInAppMessage,
        action: ActitoInAppMessage.Action,
        error: Exception?
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("message", message.toJson().toReactMap())
            arguments.putMap("action", message.toJson().toReactMap())

            if (error != null) {
                arguments.putString("error", error.message)
            }

            EventBroker.dispatchEvent("com.actito.iam.action_failed_to_execute", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.iam.action_failed_to_execute event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val NAME = "ActitoInAppMessagingModule"
        internal const val DEFAULT_ERROR_CODE = "actito_error"
    }
}
