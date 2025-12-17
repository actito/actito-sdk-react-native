package com.actito.geo.react_native

import android.app.ActivityManager
import android.content.Context
import com.actito.geo.ActitoGeoIntentReceiver
import com.actito.geo.models.ActitoBeacon
import com.actito.geo.models.ActitoLocation
import com.actito.geo.models.ActitoRegion
import com.actito.geo.react_native.ActitoGeoModuleHeadlessService.Companion.processHeadlessTask
import com.facebook.react.bridge.Arguments

public open class ActitoGeoModuleIntentReceiver : ActitoGeoIntentReceiver() {
    override fun onLocationUpdated(context: Context, location: ActitoLocation) {
        if (!isAppOnForeground(context)) {
            val event = ActitoGeoModuleHeadlessService.BackgroundEvent.LocationUpdated(location)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent(
                "com.actito.geo.location_updated",
                location.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.location_updated event.", e)
        }
    }

    override fun onRegionEntered(context: Context, region: ActitoRegion) {
        if (!isAppOnForeground(context)) {
            val event = ActitoGeoModuleHeadlessService.BackgroundEvent.RegionEntered(region)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent(
                "com.actito.geo.region_entered",
                region.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.region_entered event.", e)
        }
    }

    override fun onRegionExited(context: Context, region: ActitoRegion) {
        if (!isAppOnForeground(context)) {
            val event = ActitoGeoModuleHeadlessService.BackgroundEvent.RegionExited(region)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("com.actito.geo.region_exited", region.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.region_exited event.", e)
        }
    }

    override fun onBeaconEntered(context: Context, beacon: ActitoBeacon) {
        if (!isAppOnForeground(context)) {
            val event = ActitoGeoModuleHeadlessService.BackgroundEvent.BeaconEntered(beacon)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent(
                "com.actito.geo.beacon_entered",
                beacon.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.beacon_entered event.", e)
        }
    }

    override fun onBeaconExited(context: Context, beacon: ActitoBeacon) {
        if (!isAppOnForeground(context)) {
            val event = ActitoGeoModuleHeadlessService.BackgroundEvent.BeaconExited(beacon)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("com.actito.geo.beacon_exited", beacon.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.beacon_exited event.", e)
        }
    }

    override fun onBeaconsRanged(
        context: Context,
        region: ActitoRegion,
        beacons: List<ActitoBeacon>
    ) {
        if (!isAppOnForeground(context)) {
            val event =
                ActitoGeoModuleHeadlessService.BackgroundEvent.BeaconsRanged(beacons, region)
            processHeadlessTask(context, event)

            return
        }

        try {
            val payload = Arguments.createMap()
            payload.putMap("region", region.toJson().toReactMap())
            payload.putArray("beacons", Arguments.createArray().apply {
                beacons.forEach { pushMap(it.toJson().toReactMap()) }
            })

            EventBroker.dispatchEvent("com.actito.geo.beacons_ranged", payload)
        } catch (e: Exception) {
            logger.error("Failed to emit the com.actito.geo.beacons_ranged event.", e)
        }
    }

    private fun isAppOnForeground(context: Context): Boolean {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false
        val packageName = context.packageName

        for (appProcess in appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                appProcess.processName == packageName
            ) {
                return true
            }
        }

        return false
    }
}
