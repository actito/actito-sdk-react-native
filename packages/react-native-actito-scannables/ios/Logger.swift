import ActitoUtilitiesKit
import Foundation

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.scannables.react_native",
        category: "ActitoScannables"
    )

    logger.labelIgnoreList.append("ActitoScannables")

    return logger
}()
