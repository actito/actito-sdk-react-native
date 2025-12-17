import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.iam.react_native",
        category: "ActitoInAppMessaging",
        labelIgnoreList: ["ActitoInAppMessaging"]
    )

    return logger
}()
