import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AdhanMakam, CityData, PrayerName, PrayerNotificationConfig } from '../types/prayer';
import { calculatePrayerTimes } from './prayerTimes';
import { ADHAN_MAKAMLARI, AdhanReaderId, adhanPlayer, isAdhanMakam, resolveAdhan } from './adhan';
import { PrayerWidget } from './prayerWidget';

export type NotificationSettings = Record<PrayerName, PrayerNotificationConfig>;

const STORAGE_KEY = 'namaz_notifications';

// Native alarm ids 6000-6059 (3 days x 6 prayers x {time, reminder}); 6999 is the test alarm.
const ALARM_ID_BASE = 6000;
const DAYS_AHEAD = 3;

export const PRAYER_ORDER: PrayerName[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  imsak: 'İmsak',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
};

export const MINUTES_BEFORE_OPTIONS = [0, 5, 10, 15, 20, 30, 45, 60];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  imsak: { prayer: 'imsak', enabled: true, minutesBefore: 0, makam: 'saba', soundEnabled: true, vibrateEnabled: true },
  gunes: { prayer: 'gunes', enabled: false, minutesBefore: 0, makam: 'saba', soundEnabled: true, vibrateEnabled: false },
  ogle: { prayer: 'ogle', enabled: true, minutesBefore: 0, makam: 'rast', soundEnabled: true, vibrateEnabled: true },
  ikindi: { prayer: 'ikindi', enabled: true, minutesBefore: 0, makam: 'hicaz', soundEnabled: true, vibrateEnabled: true },
  aksam: { prayer: 'aksam', enabled: true, minutesBefore: 0, makam: 'segah', soundEnabled: true, vibrateEnabled: true },
  yatsi: { prayer: 'yatsi', enabled: true, minutesBefore: 0, makam: 'ussak', soundEnabled: true, vibrateEnabled: true },
};

export function loadNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(saved) as Partial<NotificationSettings>;
    // Merge per prayer so older/partial saves still get every field.
    const merged = {} as NotificationSettings;
    PRAYER_ORDER.forEach(p => {
      merged[p] = { ...DEFAULT_NOTIFICATION_SETTINGS[p], ...(parsed[p] || {}), prayer: p };
      // The synthesized "bip" tone was removed; fall back to the prayer's traditional makam.
      if (!isAdhanMakam(merged[p].makam)) merged[p].makam = DEFAULT_NOTIFICATION_SETTINGS[p].makam;
    });
    return merged;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable; settings stay in memory for this session
  }
}

export type PermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export async function checkNotificationPermission(): Promise<PermissionState> {
  if (Capacitor.isNativePlatform()) {
    const perm = await LocalNotifications.checkPermissions();
    return perm.display === 'granted' ? 'granted' : perm.display === 'denied' ? 'denied' : 'default';
  }
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<PermissionState> {
  if (Capacitor.isNativePlatform()) {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted' ? 'granted' : perm.display === 'denied' ? 'denied' : 'default';
  }
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.requestPermission();
}

/** Whether Android lets us schedule exact alarms ("Alarmlar ve hatırlatıcılar"). */
export async function checkExactAlarmPermission(): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'unsupported';
  const res = await LocalNotifications.checkExactNotificationSetting();
  return res.exact_alarm === 'granted' ? 'granted' : 'denied';
}

/** Opens the system "Alarms & reminders" screen for this app (Android 12+). */
export async function openExactAlarmSettings(): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'unsupported';
  const res = await LocalNotifications.changeExactNotificationSetting();
  return res.exact_alarm === 'granted' ? 'granted' : 'denied';
}

export interface PrayerAlert {
  id: number;
  at: Date;
  prayer: PrayerName;
  title: string;
  body: string;
  adhan: boolean;   // play the recorded adhan (prayer time itself, not Güneş)
  makam: AdhanMakam;
  sound: boolean;
  vibrate: boolean;
}

/**
 * Alerts for the given days: at each enabled prayer time (with the adhan, except
 * Güneş), plus an optional reminder `minutesBefore` earlier.
 */
export function buildPrayerAlerts(city: CityData, settings: NotificationSettings, from: Date, days: number): PrayerAlert[] {
  const alerts: PrayerAlert[] = [];
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const day = new Date(from.getFullYear(), from.getMonth(), from.getDate() + dayOffset);
    const times = calculatePrayerTimes(city.lat, city.lng, day, city.timezone);

    PRAYER_ORDER.forEach((prayer, i) => {
      const cfg = settings[prayer];
      if (!cfg.enabled) return;
      const label = PRAYER_LABELS[prayer];
      const time = times[prayer];
      const base = { prayer, makam: cfg.makam, sound: cfg.soundEnabled, vibrate: cfg.vibrateEnabled };
      const id = ALARM_ID_BASE + dayOffset * 20 + i * 2;

      if (cfg.minutesBefore > 0) {
        alerts.push({
          ...base, id: id + 1, adhan: false,
          at: getAlertDate(day, time, cfg.minutesBefore),
          title: `${label} vaktine ${cfg.minutesBefore} dakika kaldı`,
          body: `${label} vakti: ${time}`,
        });
      }
      alerts.push({
        ...base, id, adhan: prayer !== 'gunes',
        at: getAlertDate(day, time, 0),
        title: prayer === 'gunes' ? 'Güneş doğdu' : `${label} vakti girdi`,
        body: prayer === 'gunes' ? `Güneş doğuşu: ${time} · Kerahat vakti` : `${label} vakti: ${time}`,
      });
    });
  }
  return alerts;
}

/** Moment (device local time) `minutesBefore` minutes ahead of a prayer time on the given day. */
export function getAlertDate(day: Date, prayerTime: string, minutesBefore: number): Date {
  const [h, m] = prayerTime.split(':').map(Number);
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0);
  d.setMinutes(d.getMinutes() - minutesBefore);
  return d;
}

// Prayer alerts used to be scheduled through LocalNotifications (ids 5000-5099); clear any leftovers.
async function cancelLegacyLocalNotifications() {
  const pending = await LocalNotifications.getPending();
  const ours = pending.notifications.filter(n => n.id >= 5000 && n.id <= 5099);
  if (ours.length) {
    await LocalNotifications.cancel({ notifications: ours.map(n => ({ id: n.id })) });
  }
}

/** Makams the current settings will actually play. */
export function makamsInUse(settings: NotificationSettings): AdhanMakam[] {
  const set = new Set<AdhanMakam>();
  PRAYER_ORDER.forEach(p => {
    const cfg = settings[p];
    if (p !== 'gunes' && cfg.enabled && cfg.soundEnabled) set.add(cfg.makam);
  });
  return [...set];
}

export type AdhanDownloadStatus = Partial<Record<AdhanMakam, boolean>>;

// Native side stores recordings by key ("<reader>-<makam>"); map results back to makams.
const byMakam = (makams: AdhanMakam[], reader: AdhanReaderId, status: Record<string, boolean>): AdhanDownloadStatus =>
  Object.fromEntries(makams.map(m => [m, Boolean(status[resolveAdhan(reader, m).key])]));

export async function getAdhanDownloadStatus(makams: AdhanMakam[], reader: AdhanReaderId): Promise<AdhanDownloadStatus> {
  if (!Capacitor.isNativePlatform() || makams.length === 0) return {};
  const status = await PrayerWidget.getAdhanStatus({ makams: makams.map(m => resolveAdhan(reader, m).key) });
  return byMakam(makams, reader, status);
}

/** Downloads the recordings the alarms need so the adhan can play offline with the app closed. */
export async function downloadAdhans(makams: AdhanMakam[], reader: AdhanReaderId): Promise<AdhanDownloadStatus> {
  if (!Capacitor.isNativePlatform() || makams.length === 0) return {};
  const files = makams.map(m => {
    const { key, url } = resolveAdhan(reader, m);
    return { makam: key, url };
  });
  return byMakam(makams, reader, await PrayerWidget.downloadAdhans({ files }));
}

/**
 * Hands the next few days of prayer alarms to Android, which fires them (and plays
 * the adhan) even while the app is closed. On the web alerts are raised in-app by usePrayerAlerts.
 */
export async function schedulePrayerNotifications(city: CityData, settings: NotificationSettings, reader: AdhanReaderId) {
  if (!Capacitor.isNativePlatform()) return;

  await cancelLegacyLocalNotifications();

  const perm = await LocalNotifications.checkPermissions();
  const now = Date.now();
  const alarms = perm.display !== 'granted' ? [] : buildPrayerAlerts(city, settings, new Date(), DAYS_AHEAD)
    .filter(a => a.at.getTime() > now)
    .map(a => ({ ...a, at: a.at.getTime(), makam: resolveAdhan(reader, a.makam).key }));

  await PrayerWidget.setPrayerAlarms({ alarms });
  await downloadAdhans(makamsInUse(settings), reader);
}

const TEST_DELAY_SECONDS = 10;

/**
 * Android: fires a real prayer alarm with the adhan in a few seconds, so it can be tried with the app closed.
 * Web: shows a notification and plays the adhan in the page.
 */
export async function sendTestAdhan(makam: AdhanMakam, reader: AdhanReaderId): Promise<{ delaySeconds: number; downloaded: boolean }> {
  const adhan = resolveAdhan(reader, makam);
  if (Capacitor.isNativePlatform()) {
    const status = await downloadAdhans([makam], reader);
    const name = ADHAN_MAKAMLARI.find(m => m.id === makam)?.name ?? '';
    await PrayerWidget.testAdhan({ makam: adhan.key, delaySeconds: TEST_DELAY_SECONDS, body: `${name} · ${adhan.reader.name}` });
    return { delaySeconds: TEST_DELAY_SECONDS, downloaded: Boolean(status[makam]) };
  }
  showWebNotification('Test: Ezan', 'Vakit bildirimleri doğru çalışıyor.', 'namaz-test');
  adhanPlayer.play(adhan.url);
  return { delaySeconds: 0, downloaded: true };
}

export function showWebNotification(title: string, body: string, tag: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const options = { body, tag, icon: '/pwa-192x192.png' };
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, options))
      .catch(err => console.debug('Notification error:', err));
  } else {
    try {
      new Notification(title, options);
    } catch (err) {
      console.debug('Notification error:', err);
    }
  }
}
