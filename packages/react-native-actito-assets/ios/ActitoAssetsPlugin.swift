import ActitoAssetsKit
import ActitoKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@objc(ActitoAssetsPlugin)
public class ActitoAssetsPlugin: NSObject {

    @objc
    public func fetch(_ group: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Actito.shared.assets().fetch(group: group) { result in
            switch result {
            case let .success(assets):
                do {
                    let payload = try assets.map { try $0.toJson() }
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
