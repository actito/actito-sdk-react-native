import Foundation
import ActitoUtilitiesKit

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.inbox.react_native",
        category: "ActitoInbox"
    )

    logger.labelIgnoreList.append("ActitoInbox")

    return logger
}()
