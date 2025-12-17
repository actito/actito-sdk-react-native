package com.actito.react_native

import android.content.Context
import com.actito.ActitoIntentReceiver
import com.actito.models.ActitoApplication
import com.actito.models.ActitoDevice

public open class ActitoModuleIntentReceiver : ActitoIntentReceiver() {
    override fun onReady(context: Context, application: ActitoApplication) {
        try {
            EventBroker.dispatchEvent("com.actito.ready", application.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.ready event.", e)
        }
    }

    override fun onUnlaunched(context: Context) {
        EventBroker.dispatchEvent("com.actito.unlaunched", null)
    }

    override fun onDeviceRegistered(context: Context, device: ActitoDevice) {
        try {
            EventBroker.dispatchEvent("com.actito.device_registered", device.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.device_registered event.", e)
        }
    }
}
