import Foundation
import ActitoUtilitiesKit

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.react_native",
        category: "Actito"
    )

    logger.labelIgnoreList.append("Actito")

    return logger
}()
