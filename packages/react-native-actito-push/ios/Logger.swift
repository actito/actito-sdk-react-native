import ActitoUtilitiesKit
import Foundation

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.react_native",
        category: "ActitoPush"
    )

    logger.labelIgnoreList.append("ActitoPush")

    return logger
}()
