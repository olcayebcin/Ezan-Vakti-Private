import { CityData, PrayerTimes } from '../types/prayer';
import { NextPrayerInfo } from './prayerTimes';
import { calculatePrayerTimes } from './prayerTimes';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PrayerWidget } from './prayerWidget';

// Days of times handed to the native notification so it can roll over on its own.
const NATIVE_DAYS_AHEAD = 3;

async function updateNativeNotification(city: CityData) {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  const today = new Date();
  const days = Array.from({ length: NATIVE_DAYS_AHEAD }, (_, i) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const t = calculatePrayerTimes(city.lat, city.lng, day, city.timezone);
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    return { date, times: { imsak: t.imsak, gunes: t.gunes, ogle: t.ogle, ikindi: t.ikindi, aksam: t.aksam, yatsi: t.yatsi } };
  });

  await PrayerWidget.showOngoing({ cityName: city.name, days });
}

export async function updateOngoingNotification(
  city: CityData,
  times: PrayerTimes,
  nextInfo: NextPrayerInfo,
  enabled: boolean = true
) {
  if (!enabled) {
    return;
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await updateNativeNotification(city);
    } catch (err) {
      console.debug('Native notification update error:', err);
    }
    return;
  }

  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const title = `🕌 ${city.name}: ${nextInfo.nextPrayerName} ${nextInfo.nextPrayerTime} (${nextInfo.remainingFormatted.slice(0, 5)} kaldı)`;
  const body = `İmsak: ${times.imsak}  Güneş: ${times.gunes}  Öğle: ${times.ogle}  İkindi: ${times.ikindi}  Akşam: ${times.aksam}  Yatsı: ${times.yatsi}`;

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        tag: 'namaz-persistent-shade',
        body: body,
        icon: '/pwa-192x192.png',
        badge: '/icon.svg',
        silent: true,
        // requireInteraction tells Android not to auto-dismiss, keeping it pinned in the shade
        requireInteraction: true,
        data: { url: '/' }
      });
    } else {
      new Notification(title, {
        tag: 'namaz-persistent-shade',
        body: body,
        icon: '/pwa-192x192.png',
        silent: true,
        requireInteraction: true
      });
    }
  } catch (err) {
    console.debug('Notification update error:', err);
  }
}

export function clearOngoingNotification() {
  if (Capacitor.isNativePlatform()) {
    PrayerWidget.clearOngoing().catch(err => {
      console.debug('Native notification clear error:', err);
    });
    return;
  }
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.getNotifications({ tag: 'namaz-persistent-shade' }).then(notifications => {
        notifications.forEach(n => n.close());
      });
    });
  }
}
