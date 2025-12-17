package com.actito.push.react_native

import android.content.Context
import com.actito.models.ActitoNotification
import com.actito.push.ActitoPushIntentReceiver
import com.actito.push.models.ActitoNotificationDeliveryMechanism
import com.actito.push.models.ActitoSystemNotification
import com.actito.push.models.ActitoUnknownNotification
import com.facebook.react.bridge.Arguments

public open class ActitoPushModuleIntentReceiver : ActitoPushIntentReceiver() {
    override fun onNotificationReceived(
        context: Context,
        notification: ActitoNotification,
        deliveryMechanism: ActitoNotificationDeliveryMechanism
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putString("deliveryMechanism", deliveryMechanism.rawValue)

            EventBroker.dispatchEvent("com.actito.push.notification_info_received", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.notification_info_received event.", e)
        }
    }

    override fun onSystemNotificationReceived(context: Context, notification: ActitoSystemNotification) {
        try {
            EventBroker.dispatchEvent(
                "com.actito.push.system_notification_received",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.system_notification_received event.", e)
        }
    }

    override fun onUnknownNotificationReceived(context: Context, notification: ActitoUnknownNotification) {
        try {
            EventBroker.dispatchEvent(
                "com.actito.push.unknown_notification_received",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.unknown_notification_received event.", e)
        }
    }

    override fun onNotificationOpened(context: Context, notification: ActitoNotification) {
        try {
            EventBroker.dispatchEvent("com.actito.push.notification_opened", notification.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.notification_opened event.", e)
        }
    }

    override fun onActionOpened(
        context: Context,
        notification: ActitoNotification,
        action: ActitoNotification.Action
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("com.actito.push.notification_action_opened", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.push.notification_action_opened event.", e)
        }
    }
}
