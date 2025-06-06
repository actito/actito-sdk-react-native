import ActitoKit
import ActitoPushUIKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@objc public protocol ActitoPushUIModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(ActitoPushUIPlugin)
public class ActitoPushUIPlugin: NSObject {
    @objc public weak var delegate: ActitoPushUIModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false

        Actito.shared.pushUI().delegate = self
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
            "com.actito.push.ui.notification_will_present",
            "com.actito.push.ui.notification_presented",
            "com.actito.push.ui.notification_finished_presenting",
            "com.actito.push.ui.notification_failed_to_present",
            "com.actito.push.ui.notification_url_clicked",
            "com.actito.push.ui.action_will_execute",
            "com.actito.push.ui.action_executed",
            "com.actito.push.ui.action_not_executed",
            "com.actito.push.ui.action_failed_to_execute",
            "com.actito.push.ui.custom_action_received",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    // MARK: - Actito Push

    @objc
    public func presentNotification(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let notification: ActitoNotification

        do {
            notification = try ActitoNotification.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification with a nil root view controller.", nil)
                return
            }

            if notification.requiresViewController {
                let navigationController = self.createNavigationController()
                rootViewController.present(navigationController, animated: true) {
                    Actito.shared.pushUI().presentNotification(notification, in: navigationController)
                    resolve(nil)
                }
            } else {
                Actito.shared.pushUI().presentNotification(notification, in: rootViewController)
                resolve(nil)
            }
        }
    }

    @objc
    public func presentAction(_ notificationData: [String: Any], action actionData: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let notification: ActitoNotification
        let action: ActitoNotification.Action

        do {
            notification = try ActitoNotification.fromJson(json: notificationData)
            action = try ActitoNotification.Action.fromJson(json: actionData)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification action with a nil root view controller.", nil)
                return
            }

            Actito.shared.pushUI().presentAction(action, for: notification, in: rootViewController)
            resolve(nil)
        }
    }

    private func createNavigationController() -> UINavigationController {
        let navigationController = UINavigationController()
        let theme = Actito.shared.options?.theme(for: navigationController)

        if let colorStr = theme?.backgroundColor {
            navigationController.view.backgroundColor = UIColor(hexString: colorStr)
        } else {
            if #available(iOS 13.0, *) {
                navigationController.view.backgroundColor = .systemBackground
            } else {
                navigationController.view.backgroundColor = .white
            }
        }

        return navigationController
    }

    @objc private func onCloseClicked() {
        guard let rootViewController = rootViewController else {
            return
        }

        rootViewController.dismiss(animated: true, completion: nil)
    }
}

extension ActitoPushUIPlugin: ActitoPushUIDelegate {
    public func actito(_ actitoPushUI: ActitoPushUI, willPresentNotification notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.notification_will_present", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.notification_will_present event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didPresentNotification notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.notification_presented", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.notification_presented event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didFinishPresentingNotification notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.notification_finished_presenting", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.notification_finished_presenting event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didFailToPresentNotification notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.notification_failed_to_present", payload: try notification.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.notification_failed_to_present event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didClickURL url: URL, in notification: ActitoNotification) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "url": url.absoluteString,
            ]

            dispatchEvent("com.actito.push.ui.notification_url_clicked", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.notification_url_clicked event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, willExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.action_will_execute", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.action_will_execute event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.action_executed", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.action_executed event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didNotExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            dispatchEvent("com.actito.push.ui.action_not_executed", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.action_not_executed event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didFailToExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification, error: Error?) {
        do {
            var payload: [String: Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            dispatchEvent("com.actito.push.ui.action_failed_to_execute", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.action_failed_to_execute event.", error: error)
        }
    }

    public func actito(_ actitoPushUI: ActitoPushUI, didReceiveCustomAction url: URL, in action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
                "url": url.absoluteString,
            ]

            dispatchEvent("com.actito.push.ui.custom_action_received", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.push.ui.custom_action_received event.", error: error)
        }
    }
}

private func onMainThread(_ action: @escaping () -> Void) {
    DispatchQueue.main.async {
        action()
    }
}
