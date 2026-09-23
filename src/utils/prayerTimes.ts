import { CityData, HijriDate, PrayerTimes } from '../types/prayer';

// All 81 Turkish Provinces + Major Islamic/World Cities
export const TURKEY_CITIES: CityData[] = [
  { id: 'istanbul-sariyer', name: 'Sarıyer (İstanbul)', country: 'Türkiye', lat: 41.1686, lng: 29.0572, timezone: 3 },
  { id: 'istanbul', name: 'İstanbul', country: 'Türkiye', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { id: 'ankara', name: 'Ankara', country: 'Türkiye', lat: 39.9334, lng: 32.8597, timezone: 3, isCapital: true },
  { id: 'izmir', name: 'İzmir', country: 'Türkiye', lat: 38.4237, lng: 27.1428, timezone: 3 },
  { id: 'adana', name: 'Adana', country: 'Türkiye', lat: 37.0000, lng: 35.3213, timezone: 3 },
  { id: 'adiyaman', name: 'Adıyaman', country: 'Türkiye', lat: 37.7648, lng: 38.2786, timezone: 3 },
  { id: 'afyon', name: 'Afyonkarahisar', country: 'Türkiye', lat: 38.7507, lng: 30.5567, timezone: 3 },
  { id: 'agri', name: 'Ağrı', country: 'Türkiye', lat: 39.7191, lng: 43.0503, timezone: 3 },
  { id: 'amasya', name: 'Amasya', country: 'Türkiye', lat: 40.6534, lng: 35.8330, timezone: 3 },
  { id: 'antalya', name: 'Antalya', country: 'Türkiye', lat: 36.8969, lng: 30.7133, timezone: 3 },
  { id: 'artvin', name: 'Artvin', country: 'Türkiye', lat: 41.1828, lng: 41.8183, timezone: 3 },
  { id: 'aydin', name: 'Aydın', country: 'Türkiye', lat: 37.8560, lng: 27.8416, timezone: 3 },
  { id: 'balikesir', name: 'Balıkesir', country: 'Türkiye', lat: 39.6484, lng: 27.8826, timezone: 3 },
  { id: 'bilecik', name: 'Bilecik', country: 'Türkiye', lat: 40.1451, lng: 29.9799, timezone: 3 },
  { id: 'bingol', name: 'Bingöl', country: 'Türkiye', lat: 38.8854, lng: 40.4983, timezone: 3 },
  { id: 'bitlis', name: 'Bitlis', country: 'Türkiye', lat: 38.4006, lng: 42.1095, timezone: 3 },
  { id: 'bolu', name: 'Bolu', country: 'Türkiye', lat: 40.7358, lng: 31.6061, timezone: 3 },
  { id: 'burdur', name: 'Burdur', country: 'Türkiye', lat: 37.7203, lng: 30.2908, timezone: 3 },
  { id: 'bursa', name: 'Bursa', country: 'Türkiye', lat: 40.1885, lng: 29.0610, timezone: 3 },
  { id: 'canakkale', name: 'Çanakkale', country: 'Türkiye', lat: 40.1553, lng: 26.4142, timezone: 3 },
  { id: 'cankiri', name: 'Çankırı', country: 'Türkiye', lat: 40.6013, lng: 33.6134, timezone: 3 },
  { id: 'corum', name: 'Çorum', country: 'Türkiye', lat: 40.5506, lng: 34.9556, timezone: 3 },
  { id: 'denizli', name: 'Denizli', country: 'Türkiye', lat: 37.7765, lng: 29.0864, timezone: 3 },
  { id: 'diyarbakir', name: 'Diyarbakır', country: 'Türkiye', lat: 37.9144, lng: 40.2306, timezone: 3 },
  { id: 'edirne', name: 'Edirne', country: 'Türkiye', lat: 41.6768, lng: 26.5603, timezone: 3 },
  { id: 'elazig', name: 'Elazığ', country: 'Türkiye', lat: 38.6810, lng: 39.2264, timezone: 3 },
  { id: 'erzincan', name: 'Erzincan', country: 'Türkiye', lat: 39.7500, lng: 39.5000, timezone: 3 },
  { id: 'erzurum', name: 'Erzurum', country: 'Türkiye', lat: 39.9055, lng: 41.2658, timezone: 3 },
  { id: 'eskisehir', name: 'Eskişehir', country: 'Türkiye', lat: 39.7767, lng: 30.5206, timezone: 3 },
  { id: 'gaziantep', name: 'Gaziantep', country: 'Türkiye', lat: 37.0662, lng: 37.3833, timezone: 3 },
  { id: 'giresun', name: 'Giresun', country: 'Türkiye', lat: 40.9128, lng: 38.3895, timezone: 3 },
  { id: 'gumushane', name: 'Gümüşhane', country: 'Türkiye', lat: 40.4600, lng: 39.4814, timezone: 3 },
  { id: 'hakkari', name: 'Hakkâri', country: 'Türkiye', lat: 37.5833, lng: 43.7333, timezone: 3 },
  { id: 'hatay', name: 'Hatay', country: 'Türkiye', lat: 36.4018, lng: 36.3498, timezone: 3 },
  { id: 'isparta', name: 'Isparta', country: 'Türkiye', lat: 37.7648, lng: 30.5566, timezone: 3 },
  { id: 'mersin', name: 'Mersin', country: 'Türkiye', lat: 36.8121, lng: 34.6415, timezone: 3 },
  { id: 'kars', name: 'Kars', country: 'Türkiye', lat: 40.6167, lng: 43.1000, timezone: 3 },
  { id: 'kastamonu', name: 'Kastamonu', country: 'Türkiye', lat: 41.3887, lng: 33.7827, timezone: 3 },
  { id: 'kayseri', name: 'Kayseri', country: 'Türkiye', lat: 38.7312, lng: 35.4787, timezone: 3 },
  { id: 'kirklareli', name: 'Kırklareli', country: 'Türkiye', lat: 41.7333, lng: 27.2167, timezone: 3 },
  { id: 'kirsehir', name: 'Kırşehir', country: 'Türkiye', lat: 39.1425, lng: 34.1709, timezone: 3 },
  { id: 'kocaeli', name: 'Kocaeli (İzmit)', country: 'Türkiye', lat: 40.8533, lng: 29.8815, timezone: 3 },
  { id: 'konya', name: 'Konya', country: 'Türkiye', lat: 37.8667, lng: 32.4833, timezone: 3 },
  { id: 'kutahya', name: 'Kütahya', country: 'Türkiye', lat: 39.4167, lng: 29.9833, timezone: 3 },
  { id: 'malatya', name: 'Malatya', country: 'Türkiye', lat: 38.3552, lng: 38.3095, timezone: 3 },
  { id: 'manisa', name: 'Manisa', country: 'Türkiye', lat: 38.6191, lng: 27.4289, timezone: 3 },
  { id: 'kahramanmaras', name: 'Kahramanmaraş', country: 'Türkiye', lat: 37.5858, lng: 36.9371, timezone: 3 },
  { id: 'mardin', name: 'Mardin', country: 'Türkiye', lat: 37.3212, lng: 40.7245, timezone: 3 },
  { id: 'mugla', name: 'Muğla', country: 'Türkiye', lat: 37.2153, lng: 28.3636, timezone: 3 },
  { id: 'mus', name: 'Muş', country: 'Türkiye', lat: 38.7432, lng: 41.5064, timezone: 3 },
  { id: 'nevsehir', name: 'Nevşehir', country: 'Türkiye', lat: 38.6244, lng: 34.7144, timezone: 3 },
  { id: 'nigde', name: 'Niğde', country: 'Türkiye', lat: 37.9667, lng: 34.6833, timezone: 3 },
  { id: 'ordu', name: 'Ordu', country: 'Türkiye', lat: 40.9839, lng: 37.8764, timezone: 3 },
  { id: 'rize', name: 'Rize', country: 'Türkiye', lat: 41.0201, lng: 40.5234, timezone: 3 },
  { id: 'sakarya', name: 'Sakarya (Adapazarı)', country: 'Türkiye', lat: 40.7569, lng: 30.3783, timezone: 3 },
  { id: 'samsun', name: 'Samsun', country: 'Türkiye', lat: 41.2867, lng: 36.33, timezone: 3 },
  { id: 'siirt', name: 'Siirt', country: 'Türkiye', lat: 37.9333, lng: 41.95, timezone: 3 },
  { id: 'sinop', name: 'Sinop', country: 'Türkiye', lat: 42.0231, lng: 35.1531, timezone: 3 },
  { id: 'sivas', name: 'Sivas', country: 'Türkiye', lat: 39.7477, lng: 37.0179, timezone: 3 },
  { id: 'tekirdag', name: 'Tekirdağ', country: 'Türkiye', lat: 40.9833, lng: 27.5167, timezone: 3 },
  { id: 'tokat', name: 'Tokat', country: 'Türkiye', lat: 40.3167, lng: 36.55, timezone: 3 },
  { id: 'trabzon', name: 'Trabzon', country: 'Türkiye', lat: 41.0015, lng: 39.7178, timezone: 3 },
  { id: 'tunceli', name: 'Tunceli', country: 'Türkiye', lat: 39.1079, lng: 39.5401, timezone: 3 },
  { id: 'sanliurfa', name: 'Şanlıurfa', country: 'Türkiye', lat: 37.1674, lng: 38.7955, timezone: 3 },
  { id: 'usak', name: 'Uşak', country: 'Türkiye', lat: 38.6823, lng: 29.4082, timezone: 3 },
  { id: 'van', name: 'Van', country: 'Türkiye', lat: 38.4891, lng: 43.4089, timezone: 3 },
  { id: 'yozgat', name: 'Yozgat', country: 'Türkiye', lat: 39.8181, lng: 34.8147, timezone: 3 },
  { id: 'zonguldak', name: 'Zonguldak', country: 'Türkiye', lat: 41.4564, lng: 31.7987, timezone: 3 },
  { id: 'aksaray', name: 'Aksaray', country: 'Türkiye', lat: 38.3687, lng: 34.037, timezone: 3 },
  { id: 'bayburt', name: 'Bayburt', country: 'Türkiye', lat: 40.2552, lng: 40.2249, timezone: 3 },
  { id: 'karaman', name: 'Karaman', country: 'Türkiye', lat: 37.1759, lng: 33.2287, timezone: 3 },
  { id: 'kirikkale', name: 'Kırıkkale', country: 'Türkiye', lat: 39.8468, lng: 33.5153, timezone: 3 },
  { id: 'batman', name: 'Batman', country: 'Türkiye', lat: 37.8812, lng: 41.1294, timezone: 3 },
  { id: 'sirnak', name: 'Şırnak', country: 'Türkiye', lat: 37.5164, lng: 42.4594, timezone: 3 },
  { id: 'bartin', name: 'Bartın', country: 'Türkiye', lat: 41.6344, lng: 32.3375, timezone: 3 },
  { id: 'ardahan', name: 'Ardahan', country: 'Türkiye', lat: 41.1105, lng: 42.7022, timezone: 3 },
  { id: 'igdir', name: 'Iğdır', country: 'Türkiye', lat: 39.9196, lng: 44.0454, timezone: 3 },
  { id: 'yalova', name: 'Yalova', country: 'Türkiye', lat: 40.6551, lng: 29.2769, timezone: 3 },
  { id: 'karabuk', name: 'Karabük', country: 'Türkiye', lat: 41.2061, lng: 32.6204, timezone: 3 },
  { id: 'kilis', name: 'Kilis', country: 'Türkiye', lat: 36.7184, lng: 37.1212, timezone: 3 },
  { id: 'osmaniye', name: 'Osmaniye', country: 'Türkiye', lat: 37.0742, lng: 36.2472, timezone: 3 },
  { id: 'duzce', name: 'Düzce', country: 'Türkiye', lat: 40.8438, lng: 31.1565, timezone: 3 },

  // World Cities
  { id: 'mekke', name: 'Mekke-i Mükerreme', country: 'Suudi Arabistan', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { id: 'medine', name: 'Medine-i Münevvere', country: 'Suudi Arabistan', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { id: 'kudus', name: 'Kudüs-ü Şerif', country: 'Filistin', lat: 31.7683, lng: 35.2137, timezone: 3 },
  { id: 'berlin', name: 'Berlin', country: 'Almanya', lat: 52.5200, lng: 13.4050, timezone: 2 },
  { id: 'koln', name: 'Köln', country: 'Almanya', lat: 50.9375, lng: 6.9603, timezone: 2 },
  { id: 'londra', name: 'Londra', country: 'İngiltere', lat: 51.5074, lng: -0.1278, timezone: 1 },
  { id: 'paris', name: 'Paris', country: 'Fransa', lat: 48.8566, lng: 2.3522, timezone: 2 },
  { id: 'saraybosna', name: 'Saraybosna', country: 'Bosna-Hersek', lat: 43.8563, lng: 18.4131, timezone: 2 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Hollanda', lat: 52.3676, lng: 4.9041, timezone: 2 },
  { id: 'viyana', name: 'Viyana', country: 'Avusturya', lat: 48.2082, lng: 16.3738, timezone: 2 },
  { id: 'newyork', name: 'New York', country: 'ABD', lat: 40.7128, lng: -74.0060, timezone: -4 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japonya', lat: 35.6762, lng: 139.6503, timezone: 9 },
  { id: 'baku', name: 'Bakü', country: 'Azerbaycan', lat: 40.4093, lng: 49.8671, timezone: 4 },
];

export const DEFAULT_CITY: CityData = TURKEY_CITIES[0]; // Sarıyer (İstanbul)

// Trigonometric helpers
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (radVal: number) => (radVal * 180) / Math.PI;

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Precise prayer times calculation according to Diyanet standards
export function calculatePrayerTimes(lat: number, lng: number, date: Date, timezone: number = 3): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDay(year, month, day);
  const d = jd - 2451545.0; // days since J2000.0

  // Mean anomaly of the Sun
  const g = (357.529 + 0.98560028 * d) % 360;
  // Mean longitude of the Sun
  const q = (280.459 + 0.98564736 * d) % 360;
  // Geocentric apparent ecliptic longitude
  const L = (q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g))) % 360;

  // Mean obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Right Ascension and Declination
  const RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  const Dec = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L))));

  // Equation of Time in hours
  const EqT = q / 15 - (RA < 0 ? RA + 24 : RA);

  // Solar Noon (transit) in hours local time
  const noon = 12 + timezone - lng / 15 - EqT;

  // Diyanet angle specifications:
  // Fajr / Imsak: 18 degrees below horizon
  // Sunrise / Gunes: 0.833 degrees (atmospheric refraction)
  // Isha / Yatsi: 17 degrees below horizon

  const hourAngle = (alpha: number): number => {
    const cosHA = (Math.sin(rad(-alpha)) - Math.sin(rad(lat)) * Math.sin(rad(Dec))) /
                  (Math.cos(rad(lat)) * Math.cos(rad(Dec)));
    if (cosHA > 1) return 0; // Sun never rises
    if (cosHA < -1) return 12; // Sun never sets
    return deg(Math.acos(cosHA)) / 15;
  };

  // Asr hour angle (Diyanet uses standard 1x shadow + noon shadow)
  const asrAngle = (): number => {
    const noonShadow = Math.tan(rad(Math.abs(lat - Dec)));
    const asrAlt = deg(Math.atan(1 / (1 + noonShadow)));
    const cosHA = (Math.sin(rad(asrAlt)) - Math.sin(rad(lat)) * Math.sin(rad(Dec))) /
                  (Math.cos(rad(lat)) * Math.cos(rad(Dec)));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 12;
    return deg(Math.acos(cosHA)) / 15;
  };

  const haFajr = hourAngle(18.0);
  const haSunrise = hourAngle(0.833);
  const haAsr = asrAngle();
  const haIsha = hourAngle(17.0);

  // Temkin minutes applied as per Turkish Diyanet tradition:
  // Imsak: -2 to -4 mins temkin
  // Ogle: +5 mins temkin
  // Aksam: +7 mins temkin
  const imsakTime = noon - haFajr - (3 / 60);
  const sunriseTime = noon - haSunrise;
  const ogleTime = noon + (5 / 60);
  const ikindiTime = noon + haAsr + (4 / 60);
  const aksamTime = noon + haSunrise + (7 / 60);
  const yatsiTime = noon + haIsha + (2 / 60);

  // Sabah namazı (cemaatle kılınma vakti / Diyanet takvimi sabah vakti)
  // Genelde imsak'tan 25 dk sonra başlar, güneşe kadar sürer
  const sabahTime = imsakTime + (25 / 60);

  const formatTime = (hours: number): string => {
    let h = Math.floor(hours) % 24;
    let m = Math.floor((hours - Math.floor(hours)) * 60);
    if (h < 0) h += 24;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return {
    imsak: formatTime(imsakTime),
    sabah: formatTime(sabahTime),
    gunes: formatTime(sunriseTime),
    ogle: formatTime(ogleTime),
    ikindi: formatTime(ikindiTime),
    aksam: formatTime(aksamTime),
    yatsi: formatTime(yatsiTime),
  };
}

// Convert Gregorian date to Hijri date accurately
export function getHijriDate(date: Date): HijriDate {
  // Calibrated for September 2026:
  // 24 Eylül 2026 corresponds to 13 Rebi-ül Ahir (Rabi al-Thani) 1448 AH
  const hijriMonths = [
    'Muharrem',
    'Safer',
    'Rebi-ül Evvel',
    'Rebi-ül Ahir',
    'Cemaziye-l Evvel',
    'Cemaziye-l Ahir',
    'Recep',
    'Şaban',
    'Ramazan',
    'Şevval',
    'Zilkade',
    'Zilhicce'
  ];

  // Base reference point: 2026-09-24 is 1448-04-13 (monthIndex 3: Rebi-ül Ahir)
  const baseGregorian = new Date(2026, 8, 24); // Sept 24, 2026
  const diffDays = Math.round((date.getTime() - baseGregorian.getTime()) / (1000 * 60 * 60 * 24));

  // Islamic lunar year is ~354.367 days, lunar month ~29.530588 days
  let day = 13 + diffDays;
  let monthIndex = 3; // Rebi-ül Ahir
  let year = 1448;

  while (day > 30) {
    day -= (monthIndex % 2 === 0 ? 30 : 29);
    monthIndex++;
    if (monthIndex > 11) {
      monthIndex = 0;
      year++;
    }
  }

  while (day < 1) {
    monthIndex--;
    if (monthIndex < 0) {
      monthIndex = 11;
      year--;
    }
    day += (monthIndex % 2 === 0 ? 30 : 29);
  }

  const monthName = hijriMonths[monthIndex];
  return {
    day,
    monthName,
    monthIndex,
    year,
    formatted: `${day} ${monthName} ${year}`
  };
}

export function formatTurkishDate(date: Date): string {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export interface NextPrayerInfo {
  nextPrayer: 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';
  nextPrayerName: string;
  nextPrayerTime: string;
  currentPrayer: 'yatsi' | 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam';
  currentPrayerName: string;
  remainingSeconds: number;
  remainingFormatted: string; // HH:MM:SS
  progressPercent: number; // 0 to 100 within current prayer interval
  isKerahat: boolean; // 45 min after sunrise, 45 min before sunset, 30 min before noon
}

export function getNextPrayerInfo(times: PrayerTimes, now: Date = new Date()): NextPrayerInfo {
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const prayers = [
    { id: 'imsak' as const, name: 'İmsak', time: times.imsak },
    { id: 'gunes' as const, name: 'Güneş', time: times.gunes },
    { id: 'ogle' as const, name: 'Öğle', time: times.ogle },
    { id: 'ikindi' as const, name: 'İkindi', time: times.ikindi },
    { id: 'aksam' as const, name: 'Akşam', time: times.aksam },
    { id: 'yatsi' as const, name: 'Yatsı', time: times.yatsi },
  ];

  let nextIdx = prayers.findIndex(p => timeToMinutes(p.time) > currentMinutes);
  let currentIdx = -1;

  if (nextIdx === -1) {
    // Current time is after Yatsı, next is tomorrow's İmsak
    nextIdx = 0;
    currentIdx = prayers.length - 1; // Yatsı
  } else if (nextIdx === 0) {
    currentIdx = prayers.length - 1; // Yatsı
  } else {
    currentIdx = nextIdx - 1;
  }

  const nextP = prayers[nextIdx];
  const currP = prayers[currentIdx];

  let nextMinutes = timeToMinutes(nextP.time);
  let currMinutes = timeToMinutes(currP.time);

  if (nextMinutes <= currentMinutes) {
    nextMinutes += 24 * 60; // Next day
  }
  if (currMinutes > currentMinutes) {
    currMinutes -= 24 * 60;
  }

  const remainingMinutes = nextMinutes - currentMinutes;
  const remainingSeconds = Math.max(0, Math.floor(remainingMinutes * 60));

  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;
  const remainingFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const interval = nextMinutes - currMinutes;
  const elapsed = currentMinutes - currMinutes;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / interval) * 100));

  // Kerahat vakitleri:
  // 1. Güneş doğduktan sonra 45 dk (kerahet)
  // 2. Güneş tam tepedeyken (Öğleye 30-40 dk kala)
  // 3. Güneş batmadan önceki 45 dk (Akşama 45 dk kala, sadece o günün ikindi namazı kılınabilir)
  const gunesMin = timeToMinutes(times.gunes);
  const ogleMin = timeToMinutes(times.ogle);
  const aksamMin = timeToMinutes(times.aksam);

  const isKerahat =
    (currentMinutes >= gunesMin && currentMinutes <= gunesMin + 45) ||
    (currentMinutes >= ogleMin - 35 && currentMinutes <= ogleMin) ||
    (currentMinutes >= aksamMin - 45 && currentMinutes <= aksamMin);

  return {
    nextPrayer: nextP.id,
    nextPrayerName: nextP.name,
    nextPrayerTime: nextP.time,
    currentPrayer: currP.id,
    currentPrayerName: currP.name,
    remainingSeconds,
    remainingFormatted,
    progressPercent,
    isKerahat
  };
}

// Generate monthly / Ramadan Imsakiye
export interface ImsakiyeDay {
  dayNumber: number;
  dateStr: string;
  dayName: string;
  hijriDay: number;
  hijriMonth: string;
  times: PrayerTimes;
}

export function generateMonthlyImsakiye(lat: number, lng: number, year: number, month: number, timezone: number = 3): ImsakiyeDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const result: ImsakiyeDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const times = calculatePrayerTimes(lat, lng, date, timezone);
    const hijri = getHijriDate(date);
    result.push({
      dayNumber: d,
      dateStr: `${d} ${formatTurkishDate(date).split(' ')[1]}`,
      dayName: daysOfWeek[date.getDay()],
      hijriDay: hijri.day,
      hijriMonth: hijri.monthName,
      times
    });
  }

  return result;
}
