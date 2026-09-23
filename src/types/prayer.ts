export type PrayerName = 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';

export interface PrayerTimes {
  imsak: string;
  sabah: string; // sabah namazı başlangıcı (Diyanet'te genelde imsak ile aynı veya imsak + 20-30 dk)
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
  isCapital?: boolean;
}

export interface HijriDate {
  day: number;
  monthName: string;
  monthIndex: number;
  year: number;
  formatted: string;
}

export type AdhanMakam = 'saba' | 'rast' | 'hicaz' | 'segah' | 'ussak' | 'mekke' | 'bip';

export interface AdhanMakamInfo {
  id: AdhanMakam;
  name: string;
  prayerName: string;
  description: string;
  mood: string;
}

export interface PrayerNotificationConfig {
  prayer: PrayerName;
  enabled: boolean;
  minutesBefore: number; // 0 for exact time, 15, 30, 45
  makam: AdhanMakam;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}

export interface Mosque {
  id: string;
  name: string;
  district: string;
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  hasParking?: boolean;
  hasWomenSection?: boolean;
  historical?: boolean;
}

export interface JuzProgress {
  juzNumber: number;
  isCompleted: boolean;
  readPages: number; // 1 to 20
  readerName?: string;
  completedAt?: string;
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  transliteration: string;
  translation: string;
  ayahCount: number;
  revelationType: 'Mekke' | 'Medine';
}

export interface DailyVerse {
  id: string;
  arabic: string;
  translation: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  topic: string;
}

export interface DailyHadith {
  id: string;
  arabic?: string;
  text: string;
  narrator: string;
  source: string;
  topic: string;
}

export interface WisdomQuote {
  id: string;
  quote: string;
  author: string;
  era: string;
}

export interface DailyDua {
  id: string;
  title: string;
  arabic: string;
  turkishReading: string;
  meaning: string;
  benefit: string;
}

export interface EsmaUlHusna {
  number: number;
  nameArabic: string;
  nameTurkish: string;
  meaning: string;
  ebcedValue: number;
  virtue: string;
}
