package com.actito.loyalty.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

public abstract class ActitoLoyaltyModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun fetchPassBySerial(serial: String, promise: Promise)
    public abstract fun fetchPassByBarcode(barcode: String, promise: Promise)
    public abstract fun present(data: ReadableMap, promise: Promise)
}
