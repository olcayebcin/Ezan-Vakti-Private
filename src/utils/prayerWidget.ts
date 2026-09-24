import { registerPlugin } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { PrayerTimes } from '../types/prayer';
import { CityData } from '../types/prayer';
import { NextPrayerInfo } from './prayerTimes';

interface PrayerWidgetPlugin {
  update(options: {
    imsak: string;
    sabah: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
    nextPrayer: string;
    cityName: string;
    remaining: string;
  }): Promise<void>;
  showOngoing(options: {
    cityName: string;
    days: { date: string; times: Pick<PrayerTimes, 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi'> }[];
  }): Promise<void>;
  clearOngoing(): Promise<void>;
  setPrayerAlarms(options: {
    // makam: recording key ("<reader>-<makam>"), used as the downloaded file name
    alarms: { id: number; at: number; title: string; body: string; adhan: boolean; makam: string; sound: boolean; vibrate: boolean }[];
  }): Promise<void>;
  testAdhan(options: { makam: string; delaySeconds: number; body: string }): Promise<void>;
  stopAdhan(): Promise<void>;
  getAdhanStatus(options: { makams: string[] }): Promise<Record<string, boolean>>;
  downloadAdhans(options: { files: { makam: string; url: string }[] }): Promise<Record<string, boolean>>;
}

export const PrayerWidget = registerPlugin<PrayerWidgetPlugin>('PrayerWidget');

export async function updatePrayerWidget(city: CityData, times: PrayerTimes, nextInfo: NextPrayerInfo) {
  if (!Capacitor.isNativePlatform()) return;

  await PrayerWidget.update({
    imsak: times.imsak,
    sabah: times.sabah,
    gunes: times.gunes,
    ogle: times.ogle,
    ikindi: times.ikindi,
    aksam: times.aksam,
    yatsi: times.yatsi,
    nextPrayer: nextInfo.nextPrayer,
    cityName: city.name,
    remaining: nextInfo.remainingFormatted.slice(0, 5),
  });
}