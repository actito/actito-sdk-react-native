import React
import ActitoKit
import ActitoScannablesKit
import UIKit

private let DEFAULT_ERROR_CODE = "actito_error"

@objc public protocol ActitoScannablesModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(ActitoScannablesPlugin)
public class ActitoScannablesPlugin: NSObject {
    @objc public weak var delegate: ActitoScannablesModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    override public init() {
        super.init()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false

        Actito.shared.scannables().delegate = self
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
            "com.actito.scannables.scannable_detected",
            "com.actito.scannables.scannable_session_failed",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Actito Scannables

    @objc
    public func canStartNfcScannableSession(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Actito.shared.scannables().canStartNfcScannableSession)
    }

    @objc
    public func startScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session with a nil root view controller.", nil)
                return
            }

            Actito.shared.scannables().startScannableSession(controller: rootViewController)
            resolve(nil)
        }
    }

    @objc
    public func startNfcScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            Actito.shared.scannables().startNfcScannableSession()
            resolve(nil)
        }
    }

    @objc
    public func startQrCodeScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session with a nil root view controller.", nil)
                return
            }

            Actito.shared.scannables().startQrCodeScannableSession(controller: rootViewController, modal: true)
            resolve(nil)
        }
    }

    @objc
    public func fetch(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.scannables().fetch(tag: tag) { result in
            switch result {
            case let .success(scannable):
                do {
                    let payload = try scannable.toJson()
                    resolve(payload)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}

extension ActitoScannablesPlugin: ActitoScannablesDelegate {
    public func actito(_ actitoScannables: ActitoScannables, didDetectScannable scannable: ActitoScannable) {
        do {
            dispatchEvent("com.actito.scannables.scannable_detected", payload: try scannable.toJson())
        } catch {
            logger.error("Failed to emit the com.actito.scannables.scannable_detected event.", error: error)
        }
    }

    public func actito(_ actitoScannables: ActitoScannables, didInvalidateScannerSession error: Error) {
        dispatchEvent("com.actito.scannables.scannable_session_failed", payload: error.localizedDescription)
    }
}
