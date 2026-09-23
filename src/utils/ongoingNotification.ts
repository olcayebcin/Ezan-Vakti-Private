import { CityData, PrayerTimes } from '../types/prayer';
import { NextPrayerInfo } from './prayerTimes';

export async function updateOngoingNotification(
  city: CityData,
  times: PrayerTimes,
  nextInfo: NextPrayerInfo,
  enabled: boolean = true
) {
  if (!enabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }

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
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.getNotifications({ tag: 'namaz-persistent-shade' }).then(notifications => {
        notifications.forEach(n => n.close());
      });
    });
  }
}
