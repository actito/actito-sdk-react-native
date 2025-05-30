import React
import ActitoKit
import ActitoInboxKit

private let DEFAULT_ERROR_CODE = "actito_error"

@objc public protocol ActitoInboxModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(ActitoInboxPlugin)
public class ActitoInboxPlugin: NSObject {
    @objc public weak var delegate: ActitoInboxModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false

        Actito.shared.inbox().delegate = self
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
            "com.actito.inbox.inbox_updated",
            "com.actito.inbox.badge_updated",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Actito Inbox

    @objc
    public func getItems(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let payload = try Actito.shared.inbox().items.map { try $0.toJson() }
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func getBadge(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.inbox().badge)
    }

    @objc
    public func refresh(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.inbox().refresh()
        resolve(nil)
    }

    @objc
    public func open(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.inbox().open(item) { result in
            switch result {
            case let .success(notification):
                do {
                    let payload = try notification.toJson()
                    resolve(payload)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func markAsRead(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.inbox().markAsRead(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func markAllAsRead(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.inbox().markAllAsRead { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func remove(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.inbox().remove(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func clear(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.inbox().clear { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}

extension ActitoInboxPlugin: ActitoInboxDelegate {
    public func actito(_ actitoInbox: ActitoInbox, didUpdateInbox items: [ActitoInboxItem]) {
        do {
            dispatchEvent("com.actito.inbox.inbox_updated", payload: try items.map { try $0.toJson() })
        } catch {
            logger.error("Failed to emit the com.actito.inbox.inbox_updated event.", error: error)
        }
    }

    public func actito(_ actitoInbox: ActitoInbox, didUpdateBadge badge: Int) {
        dispatchEvent("com.actito.inbox.badge_updated", payload: badge)
    }
}
