import ActitoKit
import ActitoLoyaltyKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@MainActor
@objc(ActitoLoyaltyPlugin)
public class ActitoLoyaltyPlugin: NSObject {

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    @objc
    public func fetchPassBySerial(_ serial: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.loyalty().fetchPass(serial: serial) { result in
            switch result {
            case let .success(pass):
                do {
                    let payload = try pass.toJson()
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
    public func fetchPassByBarcode(_ barcode: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.loyalty().fetchPass(barcode: barcode) { result in
            switch result {
            case let .success(pass):
                do {
                    let payload = try pass.toJson()
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
    public func present(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let pass: ActitoPass

        do {
            pass = try ActitoPass.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a pass with a nil root view controller.", nil)
                return
            }

            Actito.shared.loyalty().present(pass: pass, in: rootViewController)
            resolve(nil)
        }
    }
}
