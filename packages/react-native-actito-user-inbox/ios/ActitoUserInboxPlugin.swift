import ActitoKit
import ActitoUserInboxKit
import React

private let DEFAULT_ERROR_CODE = "actito_error"

@objc(ActitoUserInboxPlugin)
public class ActitoUserInboxPlugin: NSObject {

    @objc
    public func parseResponseFromJson(_ json: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let response = try Actito.shared.userInbox().parseResponse(json: json)

            let payload = try response.toJson()
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func parseResponseFromString(_ json: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let response = try Actito.shared.userInbox().parseResponse(string: json)

            let payload = try response.toJson()
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func open(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: ActitoUserInboxItem

        do {
            item = try ActitoUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.userInbox().open(item) { result in
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
        let item: ActitoUserInboxItem

        do {
            item = try ActitoUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.userInbox().markAsRead(item) { result in
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
        let item: ActitoUserInboxItem

        do {
            item = try ActitoUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Actito.shared.userInbox().remove(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}
