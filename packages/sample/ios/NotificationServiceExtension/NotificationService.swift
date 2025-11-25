//
//  NotificationService.swift
//  NotificationServiceExtension
//
//  Created by Yevhenii Smirnov on 25/11/2025.
//

import ActitoNotificationServiceExtensionKit
import UserNotifications

class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        ActitoNotificationServiceExtension.handleNotificationRequest(request) { result in
            switch result {
            case let .success(content):
                contentHandler(content)

            case let .failure(error):
                print("Failed to handle the notification request.\n\(error)")
                contentHandler(request.content)
            }
        }
    }

    override func serviceExtensionTimeWillExpire() {

    }
}
