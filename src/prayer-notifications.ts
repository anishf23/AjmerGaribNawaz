import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import {
  buildPrayerNotifications,
  buildPrayerNotificationsForPrayer,
} from './prayer-utils';

type NotificationModuleType = {
  requestPermission?: () => Promise<boolean>;
  canScheduleExactAlarms?: () => Promise<boolean>;
  openExactAlarmSettings?: () => Promise<boolean>;
  schedulePrayerNotifications: (
    notifications: {
      id: string;
      title: string;
      body: string;
      timestamp: number;
    }[],
  ) => Promise<boolean>;
  cancelPrayerNotifications: () => Promise<boolean>;
};

const { PrayerNotificationModule } = NativeModules as {
  PrayerNotificationModule: NotificationModuleType;
};

function getModule() {
  if (!PrayerNotificationModule) {
    throw new Error(
      'PrayerNotificationModule is unavailable. Rebuild the Android/iOS app after adding native notification code.',
    );
  }

  return PrayerNotificationModule;
}

async function requestAndroidPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function schedulePrayerNotifications() {
  const module = getModule();

  if (Platform.OS === 'android' && Platform.Version >= 31) {
    const canScheduleExactAlarms = await module.canScheduleExactAlarms?.();

    if (!canScheduleExactAlarms) {
      await module.openExactAlarmSettings?.();
      throw new Error(
        'Allow exact alarms for this app in Android settings, then tap Enable Alerts again.',
      );
    }
  }

  const granted =
    Platform.OS === 'ios'
      ? await module.requestPermission?.()
      : await requestAndroidPermission();

  if (!granted) {
    return false;
  }

  const notifications = buildPrayerNotifications();
  await module.schedulePrayerNotifications(notifications);
  return true;
}

export async function schedulePrayerNotificationsForPrayer(prayerName: string) {
  return schedulePrayerNotificationsForPrayerNames([prayerName]);
}

export async function schedulePrayerNotificationsForPrayerNames(prayerNames: string[]) {
  const module = getModule();

  if (Platform.OS === 'android' && Platform.Version >= 31) {
    const canScheduleExactAlarms = await module.canScheduleExactAlarms?.();

    if (!canScheduleExactAlarms) {
      await module.openExactAlarmSettings?.();
      throw new Error(
        'Allow exact alarms for this app in Android settings, then tap the prayer alert again.',
      );
    }
  }

  const granted =
    Platform.OS === 'ios'
      ? await module.requestPermission?.()
      : await requestAndroidPermission();

  if (!granted) {
    return false;
  }

  const notifications = prayerNames.flatMap(prayerName =>
    buildPrayerNotificationsForPrayer(prayerName),
  );
  await module.schedulePrayerNotifications(notifications);
  return true;
}

export async function cancelPrayerNotifications() {
  const module = getModule();

  await module.cancelPrayerNotifications();
}
