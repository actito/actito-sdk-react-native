import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.geo.react_native",
        category: "ActitoGeo",
        labelIgnoreList: ["ActitoGeo"]
    )

    return logger
}()
