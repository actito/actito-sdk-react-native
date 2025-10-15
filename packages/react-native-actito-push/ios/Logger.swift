import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.react_native",
        category: "ActitoPush",
        labelIgnoreList: ["ActitoPush"]
    )

    return logger
}()
