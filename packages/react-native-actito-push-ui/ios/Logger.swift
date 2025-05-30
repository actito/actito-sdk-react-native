import Foundation
import ActitoUtilitiesKit

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.ui.react_native",
        category: "ActitoPushUI"
    )

    logger.labelIgnoreList.append("ActitoPushUI")

    return logger
}()
