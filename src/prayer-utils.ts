import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

export type PrayerPoint = {
  name: string;
  time: Date;
};

export type ScheduledPrayerNotification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
};

const coordinates = new Coordinates(19.076, 72.8777);
const params = CalculationMethod.MuslimWorldLeague();
const IST_TIME_ZONE = 'Asia/Kolkata';
export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

function getPrayerTimes(date: Date) {
  return new PrayerTimes(coordinates, date, params);
}

export function getPrayerList(date: Date): PrayerPoint[] {
  const times = getPrayerTimes(date);
  return [
    { name: PRAYER_NAMES[0], time: times.fajr },
    { name: PRAYER_NAMES[1], time: times.dhuhr },
    { name: PRAYER_NAMES[2], time: times.asr },
    { name: PRAYER_NAMES[3], time: times.maghrib },
    { name: PRAYER_NAMES[4], time: times.isha },
  ];
}

function formatPrayerTime(time: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: IST_TIME_ZONE,
  }).format(time);
}

export function buildPrayerNotifications(daysAhead = 12): ScheduledPrayerNotification[] {
  const notifications: ScheduledPrayerNotification[] = [];
  const now = Date.now();

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    getPrayerList(date).forEach(prayer => {
      const timestamp = prayer.time.getTime();

      if (timestamp > now) {
        notifications.push({
          id: `prayer-${prayer.name.toLowerCase()}-${date.toISOString().slice(0, 10)}`,
          title: `${prayer.name} Prayer`,
          body: `It's time for ${prayer.name} prayer at ${formatPrayerTime(prayer.time)}.`,
          timestamp,
        });
      }
    });
  }

  return notifications;
}

export function buildPrayerNotificationsForPrayer(
  prayerName: string,
  daysAhead = 12,
): ScheduledPrayerNotification[] {
  return buildPrayerNotifications(daysAhead).filter(notification =>
    notification.id.includes(`prayer-${prayerName.toLowerCase()}-`),
  );
}

export { IST_TIME_ZONE };
