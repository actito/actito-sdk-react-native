import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.react_native",
        category: "Actito",
        labelIgnoreList: ["Actito"]
    )

    return logger
}()
