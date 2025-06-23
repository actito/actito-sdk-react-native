import ActitoUtilitiesKit
import Foundation

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.iam.react_native",
        category: "ActitoInAppMessaging"
    )

    logger.labelIgnoreList.append("ActitoInAppMessaging")

    return logger
}()
