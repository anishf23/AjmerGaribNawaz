package com.mygni

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = PrayerNotificationModule.NAME)
class PrayerNotificationModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun requestPermission(promise: Promise) {
    promise.resolve(true)
  }

  @ReactMethod
  fun canScheduleExactAlarms(promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
      promise.resolve(true)
      return
    }

    val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    promise.resolve(alarmManager.canScheduleExactAlarms())
  }

  @ReactMethod
  fun openExactAlarmSettings(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val intent =
          Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
            data = Uri.parse("package:${reactContext.packageName}")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          }

        reactContext.startActivity(intent)
      }

      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("exact_alarm_settings_failed", error.message, error)
    }
  }

  @ReactMethod
  fun schedulePrayerNotifications(notifications: ReadableArray, promise: Promise) {
    try {
      createNotificationChannel()
      cancelPrayerNotificationsInternal()

      val storedIds = mutableSetOf<String>()
      val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
        promise.reject(
          "exact_alarm_denied",
          "Exact alarm permission is required on Android. Please allow alarms for this app and try again.",
        )
        return
      }

      for (index in 0 until notifications.size()) {
        val item = notifications.getMap(index) ?: continue
        val id = item.getString("id") ?: continue
        val title = item.getString("title") ?: continue
        val body = item.getString("body") ?: continue
        val timestamp = item.getDouble("timestamp").toLong()

        val intent = Intent(reactContext, PrayerNotificationReceiver::class.java).apply {
          putExtra("notificationId", id.hashCode())
          putExtra("title", title)
          putExtra("body", body)
        }

        val pendingIntent =
          PendingIntent.getBroadcast(
            reactContext,
            id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
          )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            timestamp,
            pendingIntent,
          )
        } else {
          alarmManager.setExact(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent)
        }

        storedIds.add(id)
      }

      reactContext
        .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putStringSet(KEY_NOTIFICATION_IDS, storedIds)
        .apply()

      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("schedule_failed", error.message, error)
    }
  }

  @ReactMethod
  fun cancelPrayerNotifications(promise: Promise) {
    try {
      cancelPrayerNotificationsInternal()
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("cancel_failed", error.message, error)
    }
  }

  private fun cancelPrayerNotificationsInternal() {
    val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val storedIds = prefs.getStringSet(KEY_NOTIFICATION_IDS, emptySet()) ?: emptySet()

    storedIds.forEach { id ->
      val intent = Intent(reactContext, PrayerNotificationReceiver::class.java)
      val pendingIntent =
        PendingIntent.getBroadcast(
          reactContext,
          id.hashCode(),
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

      alarmManager.cancel(pendingIntent)
      pendingIntent.cancel()
    }

    val notificationManager =
      reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    notificationManager.cancelAll()
    prefs.edit().remove(KEY_NOTIFICATION_IDS).apply()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val notificationManager =
      reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channel =
      NotificationChannel(
        CHANNEL_ID,
        "Prayer Notifications",
        NotificationManager.IMPORTANCE_HIGH,
      ).apply {
        description = "Prayer time reminders"
      }

    notificationManager.createNotificationChannel(channel)
  }

  companion object {
    const val NAME = "PrayerNotificationModule"
    const val CHANNEL_ID = "prayer_notifications"
    private const val PREFS_NAME = "prayer_notification_prefs"
    private const val KEY_NOTIFICATION_IDS = "notification_ids"
  }
}
