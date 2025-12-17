import ActitoInAppMessagingKit
import ActitoKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@objc public protocol ActitoInAppMessagingModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@MainActor
@objc(ActitoInAppMessagingPlugin)
public class ActitoInAppMessagingPlugin: NSObject {
    @objc public weak var delegate: ActitoInAppMessagingModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false

        Actito.shared.inAppMessaging().delegate = self
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
            "com.actito.iam.message_presented",
            "com.actito.iam.message_finished_presenting",
            "com.actito.iam.message_failed_to_present",
            "com.actito.iam.action_executed",
            "com.actito.iam.action_failed_to_execute",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Actito In-App Messaging

    @objc
    public func hasMessagesSuppressed(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.inAppMessaging().hasMessagesSuppressed)
    }

    @objc
    public func setMessagesSuppressed(_ data: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        guard let suppressed = data["suppressed"] as? Bool else {
            reject(DEFAULT_ERROR_CODE, "Missing 'suppressed' parameter.", nil)
            return
        }

        let evaluateContext = data["evaluateContext"] as? Bool ?? false

        Actito.shared.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext: evaluateContext)

        resolve(nil)
    }
}

extension ActitoInAppMessagingPlugin: ActitoInAppMessagingDelegate {
    public func actito(_ actito: ActitoInAppMessaging, didPresentMessage message: ActitoInAppMessage) {
        do {
            dispatchEvent("com.actito.iam.message_presented", payload: try message.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.iam.message_presented event.", error: error)
        }
    }

    public func actito(_ actito: ActitoInAppMessaging, didFinishPresentingMessage message: ActitoInAppMessage) {
        do {
            dispatchEvent("com.actito.iam.message_finished_presenting", payload: try message.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.iam.message_finished_presenting event.", error: error)
        }
    }

    public func actito(_ actito: ActitoInAppMessaging, didFailToPresentMessage message: ActitoInAppMessage) {
        do {
            dispatchEvent("com.actito.iam.message_failed_to_present", payload: try message.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.iam.message_failed_to_present event.", error: error)
        }
    }

    public func actito(_ actito: ActitoInAppMessaging, didExecuteAction action: ActitoInAppMessage.Action, for message: ActitoInAppMessage) {
        do {
            dispatchEvent("com.actito.iam.action_executed", payload: [
                "message": try message.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            logger.error("Failed to emit the com.actito.iam.action_executed event.", error: error)
        }
    }

    public func actito(_ actito: ActitoInAppMessaging, didFailToExecuteAction action: ActitoInAppMessage.Action, for message: ActitoInAppMessage, error: Error?) {
        do {
            var payload: [String: Any] = [
                "message": try message.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            dispatchEvent("com.actito.iam.action_failed_to_execute", payload: payload)
        } catch {
            logger.error("Failed to emit the com.actito.iam.action_failed_to_execute event.", error: error)
        }
    }
}
