package com.ajmer.garibnawaz

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class PrayerNotificationReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val title = intent.getStringExtra("title") ?: "Prayer Time"
    val body = intent.getStringExtra("body") ?: "It's time for prayer."
    val notificationId = intent.getIntExtra("notificationId", title.hashCode())

    val launchIntent =
      context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }

    val contentIntent =
      launchIntent?.let {
        PendingIntent.getActivity(
          context,
          notificationId,
          it,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      }

    val notification =
      NotificationCompat.Builder(context, PrayerNotificationModule.CHANNEL_ID)
        .setSmallIcon(R.mipmap.ic_launcher)
        .setContentTitle(title)
        .setContentText(body)
        .setStyle(NotificationCompat.BigTextStyle().bigText(body))
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setAutoCancel(true)
        .setDefaults(NotificationCompat.DEFAULT_ALL)
        .apply {
          if (contentIntent != null) {
            setContentIntent(contentIntent)
          }
        }
        .build()

    NotificationManagerCompat.from(context).notify(notificationId, notification)
  }
}
