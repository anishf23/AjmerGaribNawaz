import Foundation
import UserNotifications

@objc(PrayerNotificationModule)
class PrayerNotificationModule: NSObject {
  private let notificationIdsKey = "prayer_notification_ids"

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(requestPermission:rejecter:)
  func requestPermission(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
      granted, error in
      if let error = error {
        reject("permission_failed", error.localizedDescription, error)
        return
      }

      resolve(granted)
    }
  }

  @objc(schedulePrayerNotifications:resolver:rejecter:)
  func schedulePrayerNotifications(
    _ notifications: [NSDictionary],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let center = UNUserNotificationCenter.current()
    cancelPrayerNotificationsInternal(center: center)

    var identifiers: [String] = []

    for item in notifications {
      guard
        let id = item["id"] as? String,
        let title = item["title"] as? String,
        let body = item["body"] as? String,
        let timestamp = item["timestamp"] as? Double
      else {
        continue
      }

      let content = UNMutableNotificationContent()
      content.title = title
      content.body = body
      content.sound = .default

      let date = Date(timeIntervalSince1970: timestamp / 1000.0)
      let components = Calendar.current.dateComponents(
        [.year, .month, .day, .hour, .minute, .second],
        from: date
      )

      let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
      let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
      identifiers.append(id)
      center.add(request)
    }

    UserDefaults.standard.set(identifiers, forKey: notificationIdsKey)
    resolve(true)
  }

  @objc(cancelPrayerNotifications:rejecter:)
  func cancelPrayerNotifications(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    cancelPrayerNotificationsInternal(center: UNUserNotificationCenter.current())
    resolve(true)
  }

  private func cancelPrayerNotificationsInternal(center: UNUserNotificationCenter) {
    let identifiers = UserDefaults.standard.stringArray(forKey: notificationIdsKey) ?? []
    center.removePendingNotificationRequests(withIdentifiers: identifiers)
    center.removeDeliveredNotifications(withIdentifiers: identifiers)
    UserDefaults.standard.removeObject(forKey: notificationIdsKey)
  }
}
