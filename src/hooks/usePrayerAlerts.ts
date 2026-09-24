import { useEffect, useMemo, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { CityData } from '../types/prayer';
import { AdhanReaderId, adhanPlayer, resolveAdhan } from '../utils/adhan';
import { NotificationSettings, buildPrayerAlerts, showWebNotification } from '../utils/prayerNotifications';

// An alert counts as due for this long after its trigger moment (covers throttled timers).
const FIRE_WINDOW_MS = 60 * 1000;

/**
 * Web only: raises prayer alerts while the page is open (notification + recorded adhan).
 * On Android the native alarms handle this, including when the app is closed.
 */
export function usePrayerAlerts(now: Date, city: CityData, settings: NotificationSettings, reader: AdhanReaderId) {
  const firedRef = useRef<Set<string>>(new Set());
  const dayKey = now.toDateString();

  const alerts = useMemo(
    () => (Capacitor.isNativePlatform() ? [] : buildPrayerAlerts(city, settings, new Date(), 1)),
    [city, settings, dayKey]
  );

  useEffect(() => {
    for (const alert of alerts) {
      const diff = now.getTime() - alert.at.getTime();
      if (diff < 0 || diff >= FIRE_WINDOW_MS) continue;

      const key = `${alert.id}-${alert.at.getTime()}`;
      if (firedRef.current.has(key)) continue;
      firedRef.current.add(key);

      showWebNotification(alert.title, alert.body, `namaz-vakit-${alert.id}`);
      if (alert.adhan && alert.sound) adhanPlayer.play(resolveAdhan(reader, alert.makam).url);
      if (alert.vibrate && 'vibrate' in navigator) navigator.vibrate([400, 200, 400]);
    }
  }, [now, alerts, reader]);
}
