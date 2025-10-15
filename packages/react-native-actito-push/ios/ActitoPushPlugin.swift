import ActitoKit
import ActitoPushKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@objc public protocol ActitoPushModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@MainActor
@objc(ActitoPushPlugin)
public class ActitoPushPlugin: NSObject {
    @objc public weak var delegate: ActitoPushModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false

        Actito.shared.push().delegate = self
    }

    @objc
    public func startObserving() {
        hasListeners = true

        if !eventQueue.isEmpty {
            logger.debug("Processing event queue with \(eventQueue.count) items.")
            eventQueue.forEach { delegate?.broadcastEvent(name: $0.name, body: $0.payload)}
            eventQueue.removeAll()
        }
    }

    @objc
    public func stopObserving() {
        hasListeners = false
    }

    @objc
    public func supportedEvents() -> [String] {
        return [
            "com.actito.push.notification_info_received",
            "com.actito.push.system_notification_received",
            "com.actito.push.unknown_notification_received",
            "com.actito.push.notification_opened",
            "com.actito.push.unknown_notification_opened",
            "com.actito.push.notification_action_opened",
            "com.actito.push.unknown_notification_action_opened",
            "com.actito.push.notification_settings_changed",
            "com.actito.push.subscription_changed",
            "com.actito.push.should_open_notification_settings",
            "com.actito.push.failed_to_register_for_remote_notifications",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Actito Push

    @objc
    public func setAuthorizationOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var authorizationOptions: UNAuthorizationOptions = []

        options.forEach { option in
            if option == "alert" {
                authorizationOptions = [authorizationOptions, .alert]
            }

            if option == "badge" {
                authorizationOptions = [authorizationOptions, .badge]
            }

            if option == "sound" {
                authorizationOptions = [authorizationOptions, .sound]
            }

            if option == "carPlay" {
                authorizationOptions = [authorizationOptions, .carPlay]
            }

            if #available(iOS 12.0, *) {
                if option == "providesAppNotificationSettings" {
                    authorizationOptions = [authorizationOptions, .providesAppNotificationSettings]
                }

                if option == "provisional" {
                    authorizationOptions = [authorizationOptions, .provisional]
                }

                if option == "criticalAlert" {
                    authorizationOptions = [authorizationOptions, .criticalAlert]
                }
            }

            if #available(iOS 13.0, *) {
                if option == "announcement" {
                    authorizationOptions = [authorizationOptions, .announcement]
                }
            }
        }

        Actito.shared.push().authorizationOptions = authorizationOptions
        resolve(nil)
    }

    @objc
    public func setCategoryOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var categoryOptions: UNNotificationCategoryOptions = []

        options.forEach { option in
            if option == "customDismissAction" {
                categoryOptions = [categoryOptions, .customDismissAction]
            }

            if option == "allowInCarPlay" {
                categoryOptions = [categoryOptions, .allowInCarPlay]
            }

            if #available(iOS 11.0, *) {
                if option == "hiddenPreviewsShowTitle" {
                    categoryOptions = [categoryOptions, .hiddenPreviewsShowTitle]
                }

                if option == "hiddenPreviewsShowSubtitle" {
                    categoryOptions = [categoryOptions, .hiddenPreviewsShowSubtitle]
                }
            }

            if #available(iOS 13.0, *) {
                if option == "allowAnnouncement" {
                    categoryOptions = [categoryOptions, .allowAnnouncement]
                }
            }
        }

        Actito.shared.push().categoryOptions = categoryOptions
        resolve(nil)
    }

    @objc
    public func setPresentationOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var presentationOptions: UNNotificationPresentationOptions = []

        options.forEach { option in
            if #available(iOS 14.0, *) {
                if option == "banner" || option == "alert" {
                    presentationOptions = [presentationOptions, .banner]
                }

                if option == "list" {
                    presentationOptions = [presentationOptions, .list]
                }
            } else {
                if option == "alert" {
                    presentationOptions = [presentationOptions, .alert]
                }
            }

            if option == "badge" {
                presentationOptions = [presentationOptions, .badge]
            }

            if option == "sound" {
                presentationOptions = [presentationOptions, .sound]
            }
        }

        Actito.shared.push().presentationOptions = presentationOptions
        resolve(nil)
    }

    @objc
    public func hasRemoteNotificationsEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.push().hasRemoteNotificationsEnabled)
    }

    @objc
    public func getTransport(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.push().transport?.rawValue)
    }

    @objc
    public func getSubscription(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let json = try Actito.shared.push().subscription?.toJson()
            resolve(json)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func allowedUI(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.push().allowedUI)
    }

    @objc
    public func enableRemoteNotifications(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.push().enableRemoteNotifications { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func disableRemoteNotifications(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.push().disableRemoteNotifications { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}

extension ActitoPushPlugin: ActitoPushDelegate {
    public func actito(_ actitoPush: ActitoPush, didReceiveNotification notification: ActitoNotification, deliveryMechanism: ActitoNotificationDeliveryMechanism) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "deliveryMechanism": deliveryMechanism.rawValue,
            ]

            dispatchEvent("com.actito.push.notification_info_received", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.push.notification_info_received event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, didReceiveSystemNotification notification: ActitoSystemNotification) {
        do {
            dispatchEvent("com.actito.push.system_notification_received", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.system_notification_received event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, didReceiveUnknownNotification userInfo: [AnyHashable: Any]) {
        dispatchEvent("com.actito.push.unknown_notification_received", payload: userInfo)
    }

    public func actito(_ actitoPush: ActitoPush, didOpenNotification notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.notification_opened", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.notification_opened event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, didOpenUnknownNotification userInfo: [AnyHashable: Any]) {
        dispatchEvent("com.actito.push.unknown_notification_opened", payload: userInfo)
    }

    public func actito(_ actitoPush: ActitoPush, didOpenAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            let payload = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]

            dispatchEvent("com.actito.push.notification_action_opened", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.push.notification_action_opened event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, didOpenUnknownAction action: String, for notification: [AnyHashable: Any], responseText: String?) {
        var payload: [String: Any] = [
            "notification": notification,
            "action": action,
        ]

        if let responseText = responseText {
            payload["responseText"] = responseText
        }

        dispatchEvent("com.actito.push.unknown_notification_action_opened", payload: payload)
    }

    public func actito(_ actitoPush: ActitoPush, didChangeNotificationSettings granted: Bool) {
        dispatchEvent("com.actito.push.notification_settings_changed", payload: granted)
    }

    public func actito(_ actitoPush: ActitoPush, didChangeSubscription subscription: ActitoPushSubscription?) {
        do {
            dispatchEvent("com.actito.push.subscription_changed", payload: try subscription?.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.subscription_changed event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, shouldOpenSettings notification: ActitoNotification?) {
        do {
            dispatchEvent("com.actito.push.should_open_notification_settings", payload: try notification?.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.should_open_notification_settings event.", error: error)
        }
    }

    public func actito(_ actitoPush: ActitoPush, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        dispatchEvent("com.actito.push.failed_to_register_for_remote_notifications", payload: error.localizedDescription)
    }
}
