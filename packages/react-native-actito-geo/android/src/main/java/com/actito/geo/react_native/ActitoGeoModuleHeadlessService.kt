package com.actito.geo.react_native

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import com.actito.geo.models.ActitoBeacon
import com.actito.geo.models.ActitoLocation
import com.actito.geo.models.ActitoRegion
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import org.json.JSONArray
import org.json.JSONObject
import java.io.Serializable

internal class ActitoGeoModuleHeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return intent?.extras?.let {
            val event = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                it.getSerializable(BUNDLE_BACKGROUND_EVENT_KEY, BackgroundEvent::class.java)
                    ?: return null
            } else {
                @Suppress("DEPRECATION")
                it.getSerializable(BUNDLE_BACKGROUND_EVENT_KEY) as? BackgroundEvent ?: return null
            }

            HeadlessJsTaskConfig(
                event.task.key,
                JSONObject(event.payload).toReactMap(),
                TASK_TIMEOUT,
                true
            )
        }
    }

    internal companion object {
        private const val TASK_TIMEOUT: Long = 60000
        private const val BUNDLE_BACKGROUND_EVENT_KEY = "backgroundEvent"

        internal fun processHeadlessTask(context: Context, event: BackgroundEvent) {
            val intent = Intent(context, ActitoGeoModuleHeadlessService::class.java)
            val bundle = Bundle().also {
                it.putSerializable(BUNDLE_BACKGROUND_EVENT_KEY, event)
            }

            intent.putExtras(bundle)
            context.startService(intent)
            acquireWakeLockNow(context)
        }
    }

    internal enum class HeadlessTask(val key: String) {
        LOCATION_UPDATED(key = "com.actito.geo.location_updated_background_callback"),
        REGION_ENTERED(key = "com.actito.geo.region_entered_background_callback"),
        REGION_EXITED(key = "com.actito.geo.region_exited_background_callback"),
        BEACON_ENTERED(key = "com.actito.geo.beacon_entered_background_callback"),
        BEACON_EXITED(key = "com.actito.geo.beacon_exited_background_callback"),
        BEACONS_RANGED(key = "com.actito.geo.beacons_ranged_background_callback"),
    }

    internal sealed class BackgroundEvent : Serializable {
        abstract val task: HeadlessTask
        abstract val payload: String

        internal class LocationUpdated(
            location: ActitoLocation
        ) : BackgroundEvent() {
            override val task = HeadlessTask.LOCATION_UPDATED
            override val payload = location.toJson().toString()
        }

        internal class RegionEntered(
            region: ActitoRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.REGION_ENTERED
            override val payload = region.toJson().toString()
        }

        internal class RegionExited(
            region: ActitoRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.REGION_EXITED
            override val payload = region.toJson().toString()
        }

        internal class BeaconEntered(
            beacon: ActitoBeacon
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACON_ENTERED
            override val payload = beacon.toJson().toString()
        }

        internal class BeaconExited(
            beacon: ActitoBeacon
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACON_EXITED
            override val payload = beacon.toJson().toString()
        }

        internal class BeaconsRanged(
            beacons: List<ActitoBeacon>,
            region: ActitoRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACONS_RANGED
            override val payload = JSONObject().apply {
                put("region", region.toJson())
                put("beacons", JSONArray(beacons.map { it.toJson() }))
            }.toString()
        }
    }
}
