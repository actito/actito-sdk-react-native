import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.ui.react_native",
        category: "ActitoPushUI",
        labelIgnoreList: ["ActitoPushUI"]
    )

    return logger
}()
