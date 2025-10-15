import ActitoUtilitiesKit
import Foundation

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.inbox.react_native",
        category: "ActitoInbox",
        labelIgnoreList: ["ActitoInbox"]
    )

    return logger
}()
